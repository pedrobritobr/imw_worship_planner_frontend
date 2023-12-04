import React from 'react';
import PropTypes from 'prop-types';

import addBtnSvg from '../../assets/add-square-svgrepo-com.svg';
import minusBtnSvg from '../../assets/minus-square-svgrepo-com.svg';

function Activity({ activity, handleInputChange, addNewActivity }) {
  const removeActivity = () => {
    console.log('Remove a atual atividade');
  };

  return (
    <div key={activity.id} className="planner-activity-row">
      <input
        type="time"
        name="hour"
        value={activity.hour}
        onChange={(e) => handleInputChange(activity.id, e)}
        placeholder="Hora"
      />
      <input
        type="text"
        name="activityTitle"
        value={activity.activityTitle}
        onChange={(e) => handleInputChange(activity.id, e)}
        placeholder="Atividade"
      />
      <div className="duration-input">
        <input
          type="number"
          min={0}
          name="duration"
          value={activity.duration}
          onChange={(e) => handleInputChange(activity.id, e)}
          placeholder="1"
        />
        <p>
          min
        </p>
      </div>
      <input
        type="text"
        name="responsible"
        value={activity.responsible}
        onChange={(e) => handleInputChange(activity.id, e)}
        placeholder="Responsável"
      />
      <div className="button-activity-container">
        <button type="button" className="button-activity" onClick={() => addNewActivity(activity)}>
          <img width={22} src={addBtnSvg} alt="Adiciona nova atividade" />
        </button>
        <button type="button" className="button-activity" onClick={removeActivity}>
          <img width={22} src={minusBtnSvg} alt="Remove a atual atividade" />
        </button>
      </div>
    </div>
  );
}

Activity.propTypes = {
  activity: PropTypes.object,
  handleInputChange: PropTypes.func,
  index: PropTypes.number,
}.isRequired;

export default Activity;
