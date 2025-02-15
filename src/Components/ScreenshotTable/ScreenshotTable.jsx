import React, { useContext } from 'react';

import { PlannerContext } from '../../Context/PlannerContext';

import { getLongDateString, columnsHeader } from '../../helpers';

import './ScreenshotTable.css';

function ScreenshotTable() {
  const { planner } = useContext(PlannerContext);
  const {
    churchName,
    worshipTitle,
    ministerSelected,
    selectedDate,
    activities,
  } = planner;

  const [weekDay, detailedDay] = getLongDateString(selectedDate).split(',');

  return (
    <div className="screenshot-table">
      <div>
        <header>
          <div className="title">
            <h3>Cronograma</h3>
            <h3>{churchName}</h3>
          </div>
          <h4>{worshipTitle}</h4>
        </header>
        <div className="details">
          <div className="details-date">
            <h5>{weekDay}</h5>
            <h5>{detailedDay}</h5>
          </div>
          <div className="details-minister">
            <h5>Ministro:</h5>
            <h5>{ministerSelected}</h5>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {columnsHeader.map((h) => (<th key={`key-${h.text}`}>{h.text}</th>))}
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={`${activity.id}`}>
              <td>{activity.hour || '00:00'}</td>
              <td>{activity.activityTitle || ''}</td>
              <td>{`${String(Number(activity.duration || 0)).padStart(2, '0')}min`}</td>
              <td>{activity.responsible || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScreenshotTable;
