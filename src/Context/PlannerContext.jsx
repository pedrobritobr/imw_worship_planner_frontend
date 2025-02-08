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

export const defaultPlanner = {
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
  const [downloadedPlanner, setDownloadedPlanner] = useState(defaultPlanner);

  const getPlanner = (p) => (Object.keys(p).length === 0 ? defaultPlanner : p);

  const storePlanner = (newPlanner) => {
    const updatedPlanner = getPlanner(newPlanner);
    setPlanner(updatedPlanner);
    localStorage.setItem('planner', JSON.stringify(updatedPlanner));
  };

  const storeDownloadedPlanner = (newPlanner) => {
    const updatedPlanner = getPlanner(newPlanner);
    setDownloadedPlanner(updatedPlanner);
  };

  const variables = {
    planner,
    setPlanner: storePlanner,
    downloadedPlanner,
    setDownloadedPlanner: storeDownloadedPlanner,
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
