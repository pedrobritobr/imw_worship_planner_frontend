import React, { useEffect, useContext, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { UserProvider, UserContext } from '@/Context/UserContext';
import { PlannerProvider, PlannerContext } from '@/Context/PlannerContext';
import { GuideTourProvider, GuideTourContext } from '@/Context/GuideTourContext';
import { PageProvider, PageContext } from '@/Context/PageContext';
import { DialogProvider, useDialog } from '@/Context/DialogContext';

import ErrorWrapper from '@/Components/ErrorWrapper';

import Menu from '@/Components/Menu';
import ActionsButton from '@/Components/ActionsButton';
import GuideTour from '@/Components/GuideTour';

import { sendLocationToAnalytics, getPlannerById } from '@/service';

import {
  validateUUID,
  generatePlannerID,
  formatDateToLocale,
} from '@/helpers';

import './App.css';

function AppContent() {
  const { user } = useContext(UserContext);

  const { currentPage, setCurrentPage, pages } = useContext(PageContext);

  const {
    planner,
    setPlanner,
    deletePlanner,
    isFetchingPlanner,
    setIsFetchingPlanner,
  } = useContext(PlannerContext);

  const { openGuideTour } = useContext(GuideTourContext);

  const [initialSetupComplete, setInitialSetupComplete] = useState(false);
  const [keepPlannerId, setKeepPlannerId] = useState(false);

  const { showDialog } = useDialog();

  useEffect(() => {
    const urlParts = window.location.pathname.split('/');
    const plannerIdUrl = urlParts[1];

    const shouldFetchPlanner = () => {
      const queryParams = new URLSearchParams(window.location.search);
      const sharedParam = queryParams.get('shared');
      const isNotShared = sharedParam !== 'true';

      if (isNotShared) return false;

      if (!plannerIdUrl) return false;

      validateUUID(plannerIdUrl);

      const plannerFromLocalStorage = JSON.parse(localStorage.getItem('planner') || '{}');
      if (plannerFromLocalStorage?.id === plannerIdUrl) return false;

      return true;
    };

    const loadPlannerFromId = async () => {
      try {
        setIsFetchingPlanner(true);
        const fetchedPlanner = await getPlannerById(plannerIdUrl);
        fetchedPlanner.selectedDate = formatDateToLocale(fetchedPlanner.selectedDate);
        setIsFetchingPlanner(false);

        setPlanner(fetchedPlanner);
      } catch (error) {
        setIsFetchingPlanner(false);

        showDialog({
          title: 'Erro',
          message: error.message,
          onCancel: () => setCurrentPage(pages.Home),
        });

        setKeepPlannerId(false);
        deletePlanner();
        if (error.message === 'Nenhum cronograma encontrado.') return;

        if (error.name !== 'UserNotLogged') return;
      } finally {
        setInitialSetupComplete(true);
      }
    };

    const shouldFetch = shouldFetchPlanner();

    if (shouldFetch && !user) {
      showDialog({
        title: 'Erro',
        message: 'Para consultar o cronograma é necessário estar autenticado.\nFaça o login ou cadastro.',
        onCancel: () => setCurrentPage(pages.Login),
      });
      return;
    }

    if (shouldFetch && user) {
      loadPlannerFromId();
    }
  }, [user]);

  useEffect(() => {
    if (!initialSetupComplete || keepPlannerId) return;

    const storedPlanner = JSON.parse(localStorage.getItem('planner'));

    if (!storedPlanner?.activities?.length) {
      deletePlanner();
      return;
    }

    const storedActivityId = storedPlanner?.activities[1]?.id;
    const currentActivityId = planner?.activities[1]?.id;

    if (storedActivityId !== currentActivityId) {
      storedPlanner.selectedDate = new Date(storedPlanner.selectedDate);
      setPlanner(storedPlanner);
    }

    if (!storedPlanner.id) {
      storedPlanner.id = generatePlannerID();
      setPlanner(storedPlanner);
    }
  }, [planner, setPlanner, initialSetupComplete, keepPlannerId]);

  useEffect(() => {
    if (!user || !openGuideTour) return;
    openGuideTour();
  }, [user, openGuideTour]);

  useEffect(() => {
    sendLocationToAnalytics(document.title, window.location.href);
  }, []);

  return (
    <div className="App">
      <header>
        <Menu />
        <h3 id="AppName">Cronograma de Culto</h3>
        {!isFetchingPlanner && currentPage.title === pages.Home.title && <ActionsButton />}
      </header>
      <SwitchTransition>
        <CSSTransition
          key={currentPage.id}
          timeout={100}
          classNames="page-fade"
        >
          {currentPage.render()}
        </CSSTransition>
      </SwitchTransition>
      <GuideTour />
    </div>
  );
}

function App() {
  return (
    <DialogProvider>
      <PageProvider>
        <PageContext.Consumer>
          {({ setCurrentPage, pages }) => (
            <UserProvider setCurrentPage={setCurrentPage} pages={pages}>
              <PlannerProvider>
                <GuideTourProvider>
                  <ErrorWrapper>
                    <AppContent />
                    <Analytics />
                  </ErrorWrapper>
                </GuideTourProvider>
              </PlannerProvider>
            </UserProvider>
          )}
        </PageContext.Consumer>
      </PageProvider>
    </DialogProvider>
  );
}

export default App;
