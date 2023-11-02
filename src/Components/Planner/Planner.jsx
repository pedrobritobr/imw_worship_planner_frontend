import React from 'react';
import PropTypes from 'prop-types';

import './Planner.css';
import plusSvg from '../../assets/plus.svg';

const emptyActivity = {
  hour: '',
  activityTitle: '',
  duration: '',
  responsible: '',
};

function Planner({
  activities,
  setActivities,
  columnsHeader,
  lastActivity,
}) {
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newEntries = [...activities];
    newEntries[index] = { ...newEntries[index], [name]: value };
    setActivities(newEntries);
  };

  const handleAddEntry = () => {
    setActivities([...activities, { ...emptyActivity }]);
  };

  return (
    <div className="planner-container">
      <div className="planner-headers">
        {columnsHeader.map((header) => (
          <h4>
            {header}
          </h4>
        ))}
      </div>
      {activities.map((entry, index) => (
        <div key={index} className="planner-activity-row">
          <input
            type="time"
            name="hour"
            value={entry.hour}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Hora"
          />
          <input
            type="text"
            name="activityTitle"
            value={entry.activityTitle}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Atividade"
          />
          <div className="duration-input">
            <input
              type="number"
              min={0}
              name="duration"
              value={entry.duration}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="1"
            />
            <p>
              min
            </p>
          </div>
          <input
            type="text"
            name="responsible"
            value={entry.responsible}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Responsável"
          />
        </div>
      ))}
      <button type="button" className="ignore-on-print" onClick={handleAddEntry}>
        <img width={15} src={plusSvg} alt="Adiciona nova atividade" />
      </button>
      <div className="planner-activity-row">
        <input
          type="time"
          name="hour"
          value={lastActivity.hour}
          placeholder="Hora"
          disabled
        />
        <input
          type="text"
          name="activityTitle"
          value={lastActivity.activityTitle}
          placeholder="Atividade"
          disabled
        />
        <input
          type="number"
          min={0}
          name="duration"
          value={lastActivity.duration}
          placeholder="Duração"
          disabled
        />
        <input
          type="text"
          name="responsible"
          value={lastActivity.responsible}
          placeholder="Responsável"
          disabled
        />
      </div>
    </div>
  );
}

Planner.propTypes = {
  columnsHeader: PropTypes.arrayOf(PropTypes.string),
  activities: PropTypes.arrayOf(PropTypes.object),
  setActivities: PropTypes.func,
}.isRequired;

export default Planner;
