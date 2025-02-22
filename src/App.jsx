import React, { useEffect, useContext } from 'react';
import { exportComponentAsPNG } from 'react-component-export-image';

import ErrorWrapper from './Components/ErrorWrapper';

import Menu from './Components/Menu';
import ActionsButton from './Components/ActionsButton';
import Main from './Components/Main';

import { UserProvider, UserContext } from './Context/UserContext';
import { PlannerProvider, PlannerContext } from './Context/PlannerContext';

import { sendLocationToAnalytics } from './service';

import {
  screenshotFilename,
  pngConfigs,
  scrollToTop,
} from './helpers';

import './App.css';

function AppContent() {
  const { user, logIn } = useContext(UserContext);
  const { planner, setPlanner, ref } = useContext(PlannerContext);

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
    const storedPlanner = JSON.parse(localStorage.getItem('planner'));

    if (!storedPlanner?.activities?.length) return;

    const storedActivityId = storedPlanner?.activities[1]?.id;
    const currentActivityId = planner?.activities[1]?.id;

    if (storedActivityId !== currentActivityId) {
      storedPlanner.selectedDate = new Date(storedPlanner.selectedDate);
      setPlanner(storedPlanner);
    }
  }, [planner, setPlanner]);

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
