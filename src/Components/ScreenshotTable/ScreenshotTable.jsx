import React from 'react';
import PropTypes from 'prop-types';

import { getLongDateString, columnsHeader } from '../../helpers';

import './ScreenshotTable.css';

function ScreenshotTable({
  selectedDate,
  activities,
  ministerSelected,
  worshipTitle,
}) {
  const [weekDay, detailedDay] = getLongDateString(selectedDate).split(',');

  return (
    <div className="screenshot-table">
      <div>
        <header>
          <div className="title">
            <h3>Cronograma</h3>
            <h3>IMW São Cristóvão</h3>
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
            <tr key={`${activity.activityTitle}-${activity.responsible}`}>
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

ScreenshotTable.propTypes = {
  columnsHeader: PropTypes.arrayOf(PropTypes.string),
  activities: PropTypes.arrayOf(PropTypes.object),
}.isRequired;

export default ScreenshotTable;
