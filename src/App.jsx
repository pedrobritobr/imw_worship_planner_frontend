import React, { useEffect, useRef, useState } from 'react';
import { exportComponentAsPNG } from 'react-component-export-image';
import axios from 'axios';

import Planner from './Components/Planner';
import ScreenshotTable from './Components/ScreenshotTable';
import DeleteLocalStorageButton from './Components/DeleteLocalStorageButton';

import downloadBtnSvg from './assets/download-square-svgrepo-com.svg';
import uploadBtnSvg from './assets/upload-square-svgrepo-com.svg';

import {
  getWeekDay,
  screenshotFilename,
  pngConfigs,
  defaultActivities,
} from './helpers';

import './App.css';

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
  const [worshipTitle, setWorshipTitle] = useState(worshipTitleLocalStorage || '');

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
      <DeleteLocalStorageButton />
      <div className="import-export">
        <button type="button" className="cloud-button" onClick={exportData}>
          <img width={40} src={uploadBtnSvg} alt="Enviar os dados para nuvem" />
        </button>
        <button type="button" className="cloud-button" onClick={importData}>
          <img width={40} src={downloadBtnSvg} alt="Baixar os dados da nuvem" />
        </button>
      </div>
      <div className="main">
        <h2>Cronograma do Culto</h2>
        <label htmlFor="worshipTitleInput">
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
        <div>
          <div className="banner" />
          <div ref={ref}>
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
