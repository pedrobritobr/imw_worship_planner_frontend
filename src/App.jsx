/* eslint-disable */

import React, { useEffect, useRef, useState, useContext } from 'react';

import { exportComponentAsPNG } from 'react-component-export-image';
import axios from 'axios';

import Planner from './Components/Planner';
import ScreenshotTable from './Components/ScreenshotTable';
import ActionsButton from './Components/ActionsButton';
import UserActions from './Components/UserActions';

import { UserProvider, UserContext } from './Context/UserContext';

import {
  getWeekDay,
  screenshotFilename,
  pngConfigs,
  defaultActivities,
} from './helpers';

import './App.css';
import { use } from 'react';

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
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const userLocalStorage = localStorage.getItem('user');
    userLocalStorage && setUser(JSON.parse(userLocalStorage));
  }, [setUser]);

  const ref = useRef(null);
  const [showScreeshotTable, setShowScreeshotTable] = useState(false);
  const imwWorshipPlannerStorage = JSON.parse(localStorage.getItem('imwWorshipPlanner')) || {};
  const {
    activities: activitiesLocalStorage,
    selectedDate: dateLocalStorage,
    ministerSelected: ministerLocalStorage,
    worshipTitle: worshipTitleLocalStorage,
    churchName: churchNameLocalStorage,
  } = imwWorshipPlannerStorage;
  const dateLocalStorageDefault = dateLocalStorage ? new Date(dateLocalStorage) : new Date();

  const [activities, setActivities] = useState(activitiesLocalStorage || defaultActivities);
  const [selectedDate, setSelectedDate] = useState(dateLocalStorageDefault);
  const [ministerSelected, setMinisterSelected] = useState(ministerLocalStorage || '');
  const [worshipTitle, setWorshipTitle] = useState(worshipTitleLocalStorage || 'Culto de Celebração');
  const [churchName, setChurchName] = useState(churchNameLocalStorage || 'Igreja Metodista Wesleyana');

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    newDate.setHours(newDate.getHours() + 3);
    setSelectedDate(newDate);
  };

  const handleWorshipTitleChange = (event) => {
    const { value } = event.target;
    setWorshipTitle(value.length > 0 ? value : 'Culto de Celebração');
  };

  const handleChurchNameChange = (event) => {
    const { value } = event.target;
    setChurchName(value.length > 0 ? value : 'Igreja Metodista Wesleyana');
  };

  const exportData = async () => {
    const data = {
      planner: {
        selectedDate,
        activities,
        ministerSelected,
      },
    };

    try {
      const headers = { keyword: import.meta.env.VITE_PLANNER_KEYWORD };
      const url = `${import.meta.env.VITE_PLANNER_URL}/planner`;

      await axios.post(url, data, { headers });
      const { alert } = window;
      alert('Cronograma enviado com sucesso!');
    } catch (error) {
      console.error(error);
    }
  };

  const importData = async () => {
    try {
      const headers = { keyword: import.meta.env.VITE_PLANNER_KEYWORD };
      const url = `${import.meta.env.VITE_PLANNER_URL}/last-planner`;

      const response = await axios.get(url, { headers });
      const { selectedDate: date, activities: acts, ministerSelected: minister } = response.data;
      setSelectedDate(new Date(date));
      setActivities(acts);
      setMinisterSelected(minister);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    sendLocationToAnalytics(document.title, window.location.href);
  }, []);

  useEffect(() => {
    if (showScreeshotTable) {
      scrollToTop();
      exportComponentAsPNG(ref, { fileName: screenshotFilename(selectedDate), ...pngConfigs });
      setShowScreeshotTable(false);
    }
    const imwWorshipPlanner = {
      activities,
      selectedDate,
      ministerSelected,
      worshipTitle,
    };
    localStorage.setItem('imwWorshipPlanner', JSON.stringify(imwWorshipPlanner));
  }, [activities, selectedDate, ministerSelected, worshipTitle, showScreeshotTable]);

  return (
    <div className="App">
      <header>
        <UserActions />
        <h3>Roteiro de Culto</h3>
        <ActionsButton setShowScreeshotTable={setShowScreeshotTable} />
      </header>
      <div className="main">
        <label htmlFor="worshipTitleInput" id="worship-title-container">
          <input
            type="text"
            id="churchNameInput"
            value={churchName}
            onChange={handleChurchNameChange}
            placeholder="Nome da igreja"
          />
          <input
            type="text"
            id="worshipTitleInput"
            value={worshipTitle}
            onChange={handleWorshipTitleChange}
            placeholder="Título do culto"
          />
        </label>
        <label htmlFor="customDateInput">
          <input
            type="date"
            id="customDateInput"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
          />
          <h4>{getWeekDay(selectedDate)}</h4>
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
      <AppContent />
    </UserProvider>
  );
}

export default App;
