// http://localhost:5173/2326df9c-beec-4382-80b9-776fa5faf4e9?shared=true
import React, { useEffect, useContext, useState } from 'react';

import ErrorWrapper from './Components/ErrorWrapper';

import Menu from './Components/Menu';
import ActionsButton from './Components/ActionsButton';

import { UserProvider, UserContext } from './Context/UserContext';
import { PlannerProvider, PlannerContext } from './Context/PlannerContext';
import { PageProvider, PageContext } from './Context/PageContext';

import { sendLocationToAnalytics, getPlannerById } from './service';

import { validateUUID } from './helpers';

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

  const [initialSetupComplete, setInitialSetupComplete] = useState(false);
  const [keepPlannerId, setKeepPlannerId] = useState(false);

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
        const { alert } = window;
        alert(error.message);

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

    if (storedPlanner.id) {
      window.history.pushState({}, '', `/${storedPlanner.id}`);
    }
  }, [planner, setPlanner, initialSetupComplete, keepPlannerId]);

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
      { currentPage.render() }
    </div>
  );
}

function App() {
  return (
    <PageProvider>
      <PageContext.Consumer>
        {({ setCurrentPage, pages }) => (
          <UserProvider setCurrentPage={setCurrentPage} pages={pages}>
            <PlannerProvider>
              <ErrorWrapper>
                <AppContent />
              </ErrorWrapper>
            </PlannerProvider>
          </UserProvider>
        )}
      </PageContext.Consumer>
    </PageProvider>
  );
}

export default App;
