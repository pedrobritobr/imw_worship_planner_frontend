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
} from '@/helpers';

import './App.css';

function AppContent() {
  const {
    user,
    logIn,
    userNotLoggedCount,
    setUserNotLoggedCount,
  } = useContext(UserContext);

  const { currentPage, setCurrentPage, pages } = useContext(PageContext);

  const {
    planner,
    setPlanner,
    isFetchingPlanner,
    setIsFetchingPlanner,
  } = useContext(PlannerContext);

  const { openGuideTour } = useContext(GuideTourContext);

  const [initialSetupComplete, setInitialSetupComplete] = useState(false);
  const [keepPlannerId, setKeepPlannerId] = useState(false);

  const { showDialog } = useDialog();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');

      if (!user && storedUser) {
        const userData = JSON.parse(storedUser);
        logIn(userData.token);
      }
    } catch (error) {
      localStorage.removeItem('user');
    }
  }, [user, logIn]);

  useEffect(() => {
    const loadPlannerFromId = async () => {
      try {
        const currentUrl = window.location.pathname + window.location.search;

        const queryParams = new URLSearchParams(window.location.search);
        const sharedParam = queryParams.get('shared');

        if (sharedParam !== 'true') return;

        const urlParts = window.location.pathname.split('/');
        const plannerIdUrl = urlParts[1];
        if (!plannerIdUrl) return;

        validateUUID(plannerIdUrl);

        const plannerFromLocalStorage = JSON.parse(localStorage.getItem('planner') || '{}');
        if (plannerFromLocalStorage?.id === plannerIdUrl) return;

        setIsFetchingPlanner(true);
        const fetchedPlanner = await getPlannerById(plannerIdUrl);
        fetchedPlanner.selectedDate = new Date(fetchedPlanner.selectedDate);
        setIsFetchingPlanner(false);

        setPlanner(fetchedPlanner);
        localStorage.setItem('planner', JSON.stringify(fetchedPlanner));
        window.history.pushState({}, '', `${currentUrl}`);
      } catch (error) {
        setIsFetchingPlanner(false);

        showDialog({
          title: 'Erro',
          message: error.message,
          onCancel: () => setCurrentPage(pages.Home),
        });

        if (error.name === 'UserNotLogged') {
          setKeepPlannerId(true);
          setUserNotLoggedCount((prevCount) => prevCount + 1);
          setCurrentPage(pages.Login);
          return;
        }

        setKeepPlannerId(false);

        if (error.message === 'Nenhum cronograma encontrado.') return;

        if (error.name !== 'UserNotLogged') {
          window.history.pushState({}, '', '/');
          return;
        }
      } finally {
        setInitialSetupComplete(true);
      }
    };

    if (userNotLoggedCount === 0) {
      loadPlannerFromId();
    }
  }, [user, setPlanner]);

  useEffect(() => {
    if (!initialSetupComplete || keepPlannerId) return;

    const storedPlanner = JSON.parse(localStorage.getItem('planner'));

    if (!storedPlanner?.activities?.length) {
      setPlanner({});
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

    if (storedPlanner.id) {
      window.history.pushState({}, '', `/${storedPlanner.id}`);
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
