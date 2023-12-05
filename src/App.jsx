import React, { useEffect, useRef, useState } from 'react';
import { exportComponentAsPNG } from 'react-component-export-image';

import Planner from './Components/Planner';
import ScreenshotTable from './Components/ScreenshotTable';
import { getActualDate, screenshotFilename } from './helpers';

import './App.css';

const columnsHeader = [
  {
    text: 'Hora',
    style: {
      margin: '2px 20px 2px 10px',
    },
    screenShotStyle: {
      width: '10px',
      fontSize: '8px',
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
  hour: '18:55',
  activityTitle: 'Cronômetro',
  duration: 5,
  responsible: 'Rede Connect',
};
const lastActivity = {
  hour: '21:00',
  activityTitle: 'Encerramento',
  duration: 0,
  responsible: '--',
};

function App() {
  const ref = useRef(null);
  const [showScreeshotTable, setShowScreeshotTable] = useState(false);
  const [activities, setActivities] = useState([firstActivity, lastActivity]);
  const today = getActualDate();

  const pngConfigs = {
    fileName: screenshotFilename(),
    html2CanvasOptions: {
      width: 350,
      scale: 3,
    },
  };

  useEffect(() => {
    if (showScreeshotTable) {
      exportComponentAsPNG(ref, pngConfigs);
      setShowScreeshotTable(false);
    }
  }, [showScreeshotTable]);

  return (
    <div className="App">
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
      { showScreeshotTable && (
      <div>
        <div className="banner" />
        <div ref={ref} className="info">
          <ScreenshotTable
            columnsHeader={columnsHeader}
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
