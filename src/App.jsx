import React, { useEffect, useContext, useState } from 'react';
import { exportComponentAsPNG } from 'react-component-export-image';

import ErrorWrapper from './Components/ErrorWrapper';

import Menu from './Components/Menu';
import ActionsButton from './Components/ActionsButton';
import Main from './Components/Main';

import { UserProvider, UserContext } from './Context/UserContext';
import { PlannerProvider, PlannerContext } from './Context/PlannerContext';

import { sendLocationToAnalytics, getPlannerById } from './service';

import {
  screenshotFilename,
  pngConfigs,
  scrollToTop,
  validateUUID,
} from './helpers';

import './App.css';

function AppContent() {
  const { user, logIn } = useContext(UserContext);
  const { planner, setPlanner, ref } = useContext(PlannerContext);
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
        const urlParts = window.location.pathname.split('/');
        const plannerIdUrl = urlParts[1];

        if (!plannerIdUrl) {
          setInitialSetupComplete(true);
          return;
        }

        validateUUID(plannerIdUrl);

        const plannerFromLocalStorage = JSON.parse(localStorage.getItem('planner') || '{}');

        if (plannerFromLocalStorage?.id === plannerIdUrl) return;

        const fetchedPlanner = await getPlannerById(plannerIdUrl);
        fetchedPlanner.selectedDate = new Date(fetchedPlanner.selectedDate);

        setPlanner(fetchedPlanner);
        localStorage.setItem('planner', JSON.stringify(fetchedPlanner));
        window.history.pushState({}, '', `/${plannerIdUrl}`);
      } catch (error) {
        const { alert } = window;
        alert(error.message);

        if (error.name === 'UserNotLogged') {
          setKeepPlannerId(true);
        }

        if (error.message === 'Nenhum cronograma encontrado.') {
          setInitialSetupComplete(true);
          setKeepPlannerId(false);
          return;
        }

        if (error.name !== 'UserNotLogged') {
          setKeepPlannerId(false);
          window.history.pushState({}, '', '/');
        }
      } finally {
        setInitialSetupComplete(true);
      }
    };

    loadPlannerFromId();
  }, [user, setPlanner]);


  useEffect(() => {
    if (!initialSetupComplete || keepPlannerId) return;

    const storedPlanner = JSON.parse(localStorage.getItem('planner'));

    if (!storedPlanner?.activities?.length) {
      setPlanner({});
      return
    };

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

  const downloadPlanner = () => {
    scrollToTop();
    const { churchName, selectedDate } = planner;
    exportComponentAsPNG(ref, {
      fileName: screenshotFilename(churchName, selectedDate),
      ...pngConfigs,
    });
  };

  return (
    <div className="App">
      <header>
        <Menu />
        <h3 id="AppName">Cronograma de Culto</h3>
        <ActionsButton downloadPlanner={downloadPlanner} />
      </header>
      <Main />
      <button type="button" className="download-button" onClick={downloadPlanner}>
        Baixar Cronograma
      </button>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <PlannerProvider>
        <ErrorWrapper>
          <AppContent />
        </ErrorWrapper>
      </PlannerProvider>
    </UserProvider>
  );
}

export default App;
