import React from 'react';
import PropTypes from 'prop-types';

import { getLongDateString, columnsHeader } from '../../helpers';

import './ScreenshotTable.css';

function ScreenshotTable({
  selectedDate,
  activities,
  ministerSelected,
  worshipTitle
}) {
  return (
    <div className="screenshot-table">
      <h3>Cronograma IMW São Cristóvão</h3>
      <div className="subtitle">
        <h4>{worshipTitle}</h4>
        <h5>{getLongDateString(selectedDate)}</h5>
        <h5>{`Ministro: ${ministerSelected}`}</h5>
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
              <td>{activity.hour}</td>
              <td>{activity.activityTitle}</td>
              <td>{`${String(activity.duration).padStart(2, '0')}min`}</td>
              <td>{activity.responsible}</td>
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
