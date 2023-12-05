import React, { useEffect, useRef, useState } from 'react';
import { exportComponentAsPNG } from 'react-component-export-image';

import Planner from './Components/Planner';
import ScreenshotTable from './Components/ScreenshotTable';

import { getActualDate, screenshotFilename, defaultActivities } from './helpers';

import './App.css';

function App() {
  const ref = useRef(null);
  const [showScreeshotTable, setShowScreeshotTable] = useState(false);
  const activitiesLocalStorage = JSON.parse(localStorage.getItem('activities'));
  const [activities, setActivities] = useState(activitiesLocalStorage || defaultActivities);
  const today = getActualDate();

  const pngConfigs = {
    fileName: screenshotFilename(),
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
        <h3>{today}</h3>
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
              today={today}
              activities={activities}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
