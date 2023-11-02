import React, { useEffect, useRef, useState } from 'react';
import { exportComponentAsPNG } from 'react-component-export-image';

import Planner from './Components/Planner';
import ScreenshotTable from './Components/ScreenshotTable';
import { getActualDate, screenshotFilename } from './helpers';

import './App.css';

const columnsHeader = ['Hora', 'Atividade', 'Duração', 'Responsável'];

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
  const [activities, setActivities] = useState([firstActivity]);
  const today = getActualDate();

  useEffect(() => {
    if (showScreeshotTable) {
      exportComponentAsPNG(ref, { fileName: screenshotFilename() });
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
          lastActivity={lastActivity}
        />
      </div>
      { showScreeshotTable && (
        <div ref={ref}>
          <ScreenshotTable
            columnsHeader={columnsHeader}
            today={today}
            activities={[...activities, lastActivity]}
          />
        </div>
      )}
      <button type="button" onClick={() => setShowScreeshotTable(true)}>Click me</button>
    </div>
  );
}

export default App;
