/* eslint-disable */

import React, { useEffect, useRef, useState, useContext } from 'react';

import { exportComponentAsPNG } from 'react-component-export-image';
import axios from 'axios';

import Planner from './Components/Planner';
import ScreenshotTable from './Components/ScreenshotTable';
import ActionsButton from './Components/ActionsButton';
import Menu from './Components/Menu';

import { UserProvider, UserContext } from './Context/UserContext';
import { PlannerProvider, PlannerContext } from './Context/PlannerContext';

import {
  getWeekDay,
  screenshotFilename,
  pngConfigs,
  defaultActivities,
} from './helpers';

import './App.css';

const sendLocationToAnalytics = async (pageTitle, location) => {
  try {
    const headers = {
      keyword: import.meta.env.VITE_BRITO_VISITORS_ANALYTICS_KEYWORD,
    };
    const data = {
      origin: location,
      pageTitle,
    };
    const url = import.meta.env.VITE_BRITO_VISITORS_ANALYTICS_URL;

    await axios.post(url, data, { headers });
  } catch (error) {
    console.error(error);
  }
};

const scrollToTop = () => {
  window.scrollTo(0, 0);
};

function AppContent() {
  const { user, logIn } = useContext(UserContext);
  const { planner, setPlanner } = useContext(PlannerContext);

  // useEffect(() => {
  //   const userLocalStorage = localStorage.getItem('user');
  //   userLocalStorage && logIn(JSON.parse(userLocalStorage));
  // }, [logIn]);

  const ref = useRef(null);
  const [showScreeshotTable, setShowScreeshotTable] = useState(false);
  const imwWorshipPlannerStorage = JSON.parse(localStorage.getItem('imwWorshipPlanner')) || {};
  const { planner: plannerLS } = imwWorshipPlannerStorage;

  const {
    activities: activitiesLocalStorage,
    selectedDate: dateLocalStorage,
    ministerSelected: ministerLocalStorage,
    worshipTitle: worshipTitleLocalStorage,
    churchName: churchNameLocalStorage,
  } = plannerLS || {};
  const dateLocalStorageDefault = dateLocalStorage ? new Date(dateLocalStorage) : new Date();

  const [activities, setActivities] = useState(activitiesLocalStorage || defaultActivities);
  const [selectedDate, setSelectedDate] = useState(dateLocalStorageDefault);
  const [ministerSelected, setMinisterSelected] = useState(ministerLocalStorage || '');
  const [worshipTitle, setWorshipTitle] = useState(worshipTitleLocalStorage || 'Culto de Celebração');
  const [churchName, setChurchName] = useState(churchNameLocalStorage || 'Igreja Metodista Wesleyana');

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    newDate.setHours(newDate.getHours() + 3);
    setPlanner({ ...planner, selectedDate: newDate });
  };

  const handleWorshipTitleChange = (event) => {
    const { value } = event.target;
    setPlanner({ ...planner, worshipTitle: value });
  };

  const handleChurchNameChange = (event) => {
    const { value } = event.target;
    setPlanner({ ...planner, churchName: value });
  };

  const formatDate = (date) => {
    console.log('date>', date);
    
    return date.toISOString().split('T')[0];
  }

  useEffect(() => {
    // sendLocationToAnalytics(document.title, window.location.href);
  }, []);

  useEffect(() => {
    if (showScreeshotTable) {
      scrollToTop();
      exportComponentAsPNG(ref, { fileName: screenshotFilename(selectedDate), ...pngConfigs });
      setShowScreeshotTable(false);
    }
    const imwWorshipPlanner = {
      user,
      planner: {
        activities,
        selectedDate,
        ministerSelected,
        worshipTitle,
      }
    };
    localStorage.setItem('imwWorshipPlanner', JSON.stringify(imwWorshipPlanner));
  }, [activities, selectedDate, ministerSelected, worshipTitle, showScreeshotTable, user]);

  return (
    <div className="App">
      <header>
        <Menu />
        <h3>Roteiro de Culto</h3>
        <ActionsButton setShowScreeshotTable={setShowScreeshotTable} />
      </header>
      <div className="main">
        <label htmlFor="worshipTitleInput" id="worship-title-container">
          <input
            type="text"
            id="churchNameInput"
            name="churchName"
            value={planner.churchName}
            onChange={handleChurchNameChange}
            placeholder="Nome da igreja"
          />
          <input
            type="text"
            id="worshipTitleInput"
            name="worshipTitle"
            value={planner.worshipTitle}
            onChange={handleWorshipTitleChange}
            placeholder="Título do culto"
          />
        </label>
        <label htmlFor="customDateInput">
          <input
            type="date"
            id="customDateInput"
            value={formatDate(planner.selectedDate)}
            onChange={handleDateChange}
          />
          <h4>{getWeekDay(planner.selectedDate)}</h4>
        </label>
        <label htmlFor="ministerInput">
          <h4> Ministro:</h4>
          <input
            type="text"
            id="ministerInput"
            value={ministerSelected}
            onChange={(e) => setMinisterSelected(e.target.value)}
          />
        </label>
        <Planner
          activities={activities}
          setActivities={setActivities}
        />
      </div>
      <button type="button" className="download-button" onClick={() => setShowScreeshotTable(true)}>
        Baixar Cronograma
      </button>
      { showScreeshotTable && (
      <div className="hidden">
        <div className="screenshot-table-container" ref={ref}>
          <ScreenshotTable
            selectedDate={selectedDate}
            activities={activities}
            ministerSelected={ministerSelected}
            worshipTitle={worshipTitle}
            churchName={churchName}
          />
        </div>
      </div>
      )}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <PlannerProvider>
        <AppContent />
      </PlannerProvider>
    </UserProvider>
  );
}

export default App;
