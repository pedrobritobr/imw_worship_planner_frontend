import React, { useEffect, useRef, useState } from 'react';
import { exportComponentAsPNG } from 'react-component-export-image';

import Planner from './Components/Planner';
import ScreenshotTable from './Components/ScreenshotTable';
import DeleteLocalStorageButton from './Components/DeleteLocalStorageButton';

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
  } = imwWorshipPlannerStorage;
  const dateLocalStorageDefault = dateLocalStorage ? new Date(dateLocalStorage) : new Date();

  const [activities, setActivities] = useState(activitiesLocalStorage || defaultActivities);
  const [selectedDate, setSelectedDate] = useState(dateLocalStorageDefault);
  const [ministerSelected, setMinisterSelected] = useState(ministerLocalStorage || '');

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    newDate.setHours(newDate.getHours() + 3);
    setSelectedDate(newDate);
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
    };
    localStorage.setItem('imwWorshipPlanner', JSON.stringify(imwWorshipPlanner));
  }, [activities, selectedDate, ministerSelected, showScreeshotTable]);

  return (
    <div className="App">
      <DeleteLocalStorageButton />
      <div className="main">
        <h2>Cronograma do Culto</h2>
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
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
