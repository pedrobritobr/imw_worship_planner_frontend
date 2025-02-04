import React, { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { userDefault } from './UserContext';

const firstActivity = {
  id: 'firstActivity',
  hour: '19:00',
  activityTitle: 'Cronômetro',
  duration: '5',
  responsible: 'Rede Connect',
};
const lastActivity = {
  id: 'lastActivity',
  hour: '21:00',
  activityTitle: 'Encerramento',
  duration: '0',
  responsible: '--',
};

const defaultPlanner = {
  activities: [firstActivity, lastActivity],
  selectedDate: new Date(),
  ministerSelected: '',
  worshipTitle: '',
  churchName: '',
  creator: userDefault,
};

export const PlannerContext = createContext();

export function PlannerProvider({ children }) {
  const [planner, setPlanner] = useState(defaultPlanner);

  const storePlanner = (newPlanner) => {
    const updatedPlanner = Object.keys(newPlanner).length === 0 ? defaultPlanner : newPlanner;
    setPlanner(updatedPlanner);
    localStorage.setItem('planner', JSON.stringify(updatedPlanner));
  };

  const variables = {
    planner,
    setPlanner: storePlanner,
  };

  const value = useMemo(() => (variables), Object.values(variables));

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
}

PlannerProvider.propTypes = {
  children: PropTypes.node,
}.isRequired;
