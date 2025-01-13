import React, { useEffect, useRef, useState } from 'react';
import { exportComponentAsPNG } from 'react-component-export-image';
import axios from 'axios';

import Planner from './Components/Planner';
import ScreenshotTable from './Components/ScreenshotTable';
import ActionsButton from './Components/ActionsButton';

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

function App() {
  const ref = useRef(null);
  const [showScreeshotTable, setShowScreeshotTable] = useState(false);
  const imwWorshipPlannerStorage = JSON.parse(localStorage.getItem('imwWorshipPlanner')) || {};
  const {
    activities: activitiesLocalStorage,
    selectedDate: dateLocalStorage,
    ministerSelected: ministerLocalStorage,
    worshipTitle: worshipTitleLocalStorage,
  } = imwWorshipPlannerStorage;
  const dateLocalStorageDefault = dateLocalStorage ? new Date(dateLocalStorage) : new Date();

  const [activities, setActivities] = useState(activitiesLocalStorage || defaultActivities);
  const [selectedDate, setSelectedDate] = useState(dateLocalStorageDefault);
  const [ministerSelected, setMinisterSelected] = useState(ministerLocalStorage || '');
  const [worshipTitle, setWorshipTitle] = useState(worshipTitleLocalStorage || 'Culto de Celebração');

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    newDate.setHours(newDate.getHours() + 3);
    setSelectedDate(newDate);
  };

  const handleWorshipTitleChange = (event) => {
    setWorshipTitle(event.target.value);
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
      <ActionsButton
        importData={importData}
        exportData={exportData}
        setShowScreeshotTable={setShowScreeshotTable}
      />
      <div className="main">
        <label htmlFor="worshipTitleInput" id="worship-title-container">
          <h3>Cronograma</h3>
          <h3>IMW São Cristovão</h3>
          <input
            type="text"
            id="worshipTitleInput"
            value={worshipTitle}
            onChange={handleWorshipTitleChange}
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
      <button type="button" className="download-button" onClick={() => setShowScreeshotTable(true)}>Baixar Cronograma</button>
      { showScreeshotTable && (
      <div className="hidden">
        <div className="screenshot-table-container" ref={ref}>
          <ScreenshotTable
            selectedDate={selectedDate}
            activities={activities}
            ministerSelected={ministerSelected}
            worshipTitle={worshipTitle}
          />
        </div>
      </div>
      )}
    </div>
  );
}

export default App;
