import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import './Planner.css';

import { setHourForActivity as setHourForNewActivity, columnsHeader, formatMinutes } from '../../helpers';
import { updateHourFromActivity, getMinutesBetweenActivities, calculateDurationRemain } from './helpers';

import Activity from './Activity';

function Planner({
  activities,
  setActivities,
}) {
  const emptyActivity = {
    hour: '',
    activityTitle: '',
    duration: '',
    responsible: '',
  };

  const invisibleColumn = {
    text: 'xx',
    style: {
      visibility: 'hidden',
    },
  };
  const columnsHeaderCp = [...columnsHeader, invisibleColumn];

  const handleInputChange = (id, e) => {
    const { name, value } = e.target;
    let activitiesUpdatedByHour = null;

    const newEntries = activities.map((activity, index, originalArray) => {
      if (activity.id === id) {
        const updatedActivity = { ...activity, [name]: value };

        if (name === 'hour') {
          const originalArrayCp = [...originalArray];

          if (index !== 0) {
            const minutes = getMinutesBetweenActivities(value, originalArrayCp[index - 1].hour);
            originalArrayCp[index - 1].duration = formatMinutes(minutes);
          }

          activitiesUpdatedByHour = updateHourFromActivity(updatedActivity, originalArray, index);
          return updatedActivity;
        }

        if (name === 'duration') {
          activitiesUpdatedByHour = updateHourFromActivity(updatedActivity, originalArray, index);
          return updatedActivity;
        }

        return updatedActivity;
      }
      return activity;
    });

    setActivities(activitiesUpdatedByHour || newEntries);
  };

  const addNewActivity = (actualActivity) => {
    const actualActivityIndex = activities.findIndex((ac) => ac.id === actualActivity.id);
    const penultimateActivityIndex = activities.length - 2;
    const shouldCalculateDuration = actualActivityIndex === penultimateActivityIndex;

    const newActivity = {
      ...emptyActivity,
      id: uuidv4(),
      hour: setHourForNewActivity(actualActivity.hour, actualActivity.duration),
      duration: shouldCalculateDuration ? calculateDurationRemain(activities, true) : 0,
    };

    const activitiesCp = [...activities];
    activitiesCp.splice(actualActivityIndex + 1, 0, newActivity);
    setActivities(activitiesCp);
  };

  const removeActivity = (activity) => {
    if (activity.id === 'firstActivity' || activity.id === 'lastActivity') {
      window.alert('Não é possível remover a primeira e última atividade');
      return;
    }
    const newActivities = activities.filter((a) => a.id !== activity.id);
    setActivities(newActivities);
  };

  return (
    <div className="planner-container">
      <div className="planner-headers">
        {columnsHeaderCp.map((header) => (
          <h4 key={header.text} style={header.style}>
            {header.text}
          </h4>
        ))}
      </div>
      {activities.map((activity) => (
        <Activity
          key={activity.id}
          activity={activity}
          handleInputChange={handleInputChange}
          addNewActivity={addNewActivity}
          removeActivity={removeActivity}
        />
      ))}
    </div>
  );
}

Planner.propTypes = {
  columnsHeader: PropTypes.arrayOf(PropTypes.string),
  activities: PropTypes.arrayOf(PropTypes.object),
  setActivities: PropTypes.func,
  lastActivity: PropTypes.object,
}.isRequired;

export default Planner;
