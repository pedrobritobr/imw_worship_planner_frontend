import React, { useContext } from 'react';

import { PlannerContext } from '@/Context/PlannerContext';

import Planner from './Planner';
import ScreenshotTable from './ScreenshotTable';
import WorshipForm from './WorshipForm';

function Main() {
  const { ref, isFetchingPlanner, downloadPlanner } = useContext(PlannerContext);

  if (isFetchingPlanner) {
    return (
      <div className="loader-container">
        <p>Carregando cronograma...</p>
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="main">
      <WorshipForm />
      <Planner />
      <div className="hide-screenshot-table-container">
        <div className="screenshot-table-container" ref={ref}>
          <ScreenshotTable />
        </div>
      </div>
      {!isFetchingPlanner
        && (
          <button type="button" className="download-button" onClick={downloadPlanner}>
            Baixar Cronograma
          </button>
        )}
    </div>
  );
}

export default Main;
