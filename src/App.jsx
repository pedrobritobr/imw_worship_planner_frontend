// http://localhost:5173/1a5504a6-f7a4-4003-ac20-cd1875c1f4be

import React, { useEffect, useContext, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
} from 'react-router';
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
  const { plannerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getPlanner = async () => {
      try {
        if (!plannerId) {
          setInitialSetupComplete(true);
          return;
        }

        validateUUID(plannerId);

        const plannerFromLocalStorage = JSON.parse(localStorage.getItem('planner'));

        if (plannerFromLocalStorage?.id === plannerId) {
          setInitialSetupComplete(true);
          return;
        }

        const fetchedPlanner = await getPlannerById(plannerId);
        fetchedPlanner.selectedDate = new Date(fetchedPlanner.selectedDate);

        setPlanner(fetchedPlanner);
        localStorage.setItem('planner', JSON.stringify(fetchedPlanner));
      } catch (error) {
        alert(error.message);

        if (error.message === 'Nenhum cronograma encontrado.' || error.name === 'UserNotLogged') {
          setInitialSetupComplete(true);
          return;
        }

        if (error.name !== 'UserNotLogged') {
          navigate('/');
        }
      } finally {
        setInitialSetupComplete(true);
      }
    };

    getPlanner();
  }, [plannerId, navigate, setPlanner]);

  useEffect(() => {
    try {
      if (!initialSetupComplete) return;

      const storedUser = localStorage.getItem('user');
      if (!user && storedUser) {
        const userData = JSON.parse(storedUser);
        logIn(userData.token);
      }
    } catch (error) {
      localStorage.removeItem('user');
    }
  }, [user, logIn, initialSetupComplete]);

  useEffect(() => {
    try {
      if (!initialSetupComplete) return;

      const storedPlanner = JSON.parse(localStorage.getItem('planner'));
      if (!storedPlanner?.activities?.length) return;

      const storedActivityId = storedPlanner?.activities[1]?.id;
      const currentActivityId = planner?.activities[1]?.id;

      if (storedActivityId !== currentActivityId) {
        storedPlanner.selectedDate = new Date(storedPlanner.selectedDate);
        setPlanner(storedPlanner);
      }
    } catch (error) {
      console.error(error);
    }
  }, [planner, setPlanner, initialSetupComplete]);

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
    <Router>
      <UserProvider>
        <PlannerProvider>
          <ErrorWrapper>
            <Routes>
              <Route path="/roteiro/:plannerId?" element={<AppContent />} />
            </Routes>
          </ErrorWrapper>
        </PlannerProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
