import React, { useContext } from 'react';

import { PlannerContext } from '@/Context/PlannerContext';

import Planner from './Planner';
import ScreenshotTable from './ScreenshotTable';
import WorshipForm from './WorshipForm';

function Main() {
  const { ref } = useContext(PlannerContext);

  return (
    <div className="main">
      <WorshipForm />
      <Planner />
      <div className="hide-screenshot-table-container">
        <div className="screenshot-table-container" ref={ref}>
          <ScreenshotTable />
        </div>
      </div>
    </div>
  );
}

export default Main;
