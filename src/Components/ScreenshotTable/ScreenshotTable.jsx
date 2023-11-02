import React from 'react';
import PropTypes from 'prop-types';

function ScreenshotTable({
  columnsHeader,
  today,
  activities,
}) {
  return (
    <div className="main">
      <h3 style={{ margin: 0 }}>Cronograma do Culto</h3>
      <h3 style={{ margin: 0 }}>IMW São Cristóvão</h3>
      <h4 style={{ margin: 0 }}>{today}</h4>
      <table>
        <thead>
          <tr>
            {columnsHeader.map((h) => (<th key={`key-${h}`}>{h}</th>))}
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
