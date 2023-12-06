import React from 'react';
import PropTypes from 'prop-types';

import { getLongDateString, columnsHeader } from '../../helpers';

import './ScreenshotTable.css';

function ScreenshotTable({
  selectedDate,
  activities,
}) {
  return (
    <div className="screenshot-table">
      <h3>Cronograma IMW São Cristóvão</h3>
      <h4>{getLongDateString(selectedDate)}</h4>
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
