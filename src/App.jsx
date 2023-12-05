import React, { useEffect, useRef, useState } from 'react';
import { exportComponentAsPNG } from 'react-component-export-image';

import Planner from './Components/Planner';
import ScreenshotTable from './Components/ScreenshotTable';
import TelaWidth from './TelaWidth';

import { getActualDate, screenshotFilename } from './helpers';

import './App.css';

const columnsHeader = [
  {
    text: 'Hora',
    style: {
      margin: '2px 20px 2px 10px',
    },
  },
  {
    text: 'Atividade',
    style: {
      margin: '2px 20px 2px 10px',
    },
  },
  {
    text: 'Duração',
    style: {
      margin: '2px 0px',
    },
  },
  {
    text: 'Responsável',
    style: {
      margin: '2px 20px 2px 10px',
    },
  },
];

const firstActivity = {
  hour: '19:00',
  activityTitle: 'Cronômetro',
  duration: '5',
  responsible: 'Rede Connect',
};
const lastActivity = {
  hour: '21:00',
  activityTitle: 'Encerramento',
  duration: '0',
  responsible: '--',
};
const defaultActivities = [firstActivity, lastActivity];

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
      width: 200,
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
      <TelaWidth />
      <div className="main">
        <h2>Cronograma do Culto</h2>
        <h3>{today}</h3>
        <Planner
          columnsHeader={columnsHeader}
          activities={activities}
          setActivities={setActivities}
        />
      </div>
      <button type="button" className="download-button" onClick={() => setShowScreeshotTable(true)}>Baixar Cronograma</button>
      {/* { showScreeshotTable && ( */}
      <div>
        <div className="banner" />
        <div ref={ref}>
          <ScreenshotTable
            columnsHeader={columnsHeader}
            today={today}
            activities={activities}
          />
        </div>
      </div>
      {/* )} */}
      {/* { showScreeshotTable && (
        <div ref={ref}>
          <ScreenshotTable
            columnsHeader={columnsHeader}
            today={today}
            activities={activities}
          />
        </div>
      )} */}
    </div>
  );
}

export default App;
