import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import './Planner.css';
import { setHourForActivity } from '../../helpers';

import Activity from './Activity';

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
  const handleInputChange = (id, e) => {
    const { name, value } = e.target;
    const newEntries = activities.map((activity) => {
      if (activity.id === id) {
        return { ...activity, [name]: value };
      }
      return activity;
    });
    setActivities(newEntries);
  };

  const addNewActivity = (prevActivity) => {
    const newActivity = {
      ...emptyActivity,
      id: uuidv4(),
      hour: setHourForActivity(prevActivity.hour, prevActivity.duration),
    };
    const previousActivityIndex = activities.findIndex((ac) => ac.id === prevActivity.id);

    console.log(prevActivity);
    console.log(previousActivityIndex);

    const activitiesCp = [...activities];
    activitiesCp.splice(previousActivityIndex + 1, 0, newActivity);
    setActivities(activitiesCp);
  };

  return (
    <div className="planner-container">
      <div className="planner-headers">
        {columnsHeader.map((header) => (
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
        />
      ))}
      <Activity
        activity={lastActivity}
        handleInputChange={() => {}}
      />
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
