/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { exportComponentAsPNG } from 'react-component-export-image';

import Planner from './Components/Planner';
import ScreenshotTable from './Components/ScreenshotTable';

import { getWeekDay, screenshotFilename, defaultActivities } from './helpers';

import './App.css';

function App() {
  const ref = useRef(null);
  const [showScreeshotTable, setShowScreeshotTable] = useState(false);
  const activitiesLocalStorage = JSON.parse(localStorage.getItem('activities'));
  const [activities, setActivities] = useState(activitiesLocalStorage || defaultActivities);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    newDate.setHours(newDate.getHours() + 3);
    setSelectedDate(newDate);
  };

  const pngConfigs = {
    fileName: screenshotFilename(selectedDate),
    html2CanvasOptions: {
      backgroundColor: '#242424',
      width: 250,
      scale: 5,
    },
  };

  useEffect(() => {
    if (showScreeshotTable) {
      exportComponentAsPNG(ref, pngConfigs);
      setShowScreeshotTable(false);
    }
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities, showScreeshotTable]);

  return (
    <div className="App">
      <div className="main">
        <h2>Cronograma do Culto</h2>

        <label htmlFor="customDateInput">
          <input
            type="date"
            id="customDateInput"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
            />
            <h4> {getWeekDay(selectedDate)}</h4>
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
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
