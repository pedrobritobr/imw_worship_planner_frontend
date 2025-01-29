import React, { createContext, useState, useMemo } from 'react';

import PropTypes from 'prop-types';

const defaultPlanner = {
  activities: [
    {
      id: '',
      hour: '',
      activityTitle: '',
      duration: '',
      responsible: '',
    },
  ],
  selectedDate: new Date(),
  ministerSelected: '',
  worshipTitle: '',
  churchName: '',
};

export const PlannerContext = createContext();

export function PlannerProvider({ children }) {
  const [planner, setPlanner] = useState(defaultPlanner);

  const variables = {
    planner,
    setPlanner,
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
