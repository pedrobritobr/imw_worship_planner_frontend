import React, { createContext, useState, useMemo } from 'react';

import PropTypes from 'prop-types';

const defaultPlanner = {
  user: {
    name: '',
    email: '',
    church: '',
  },
  planner: {
    activities: [
      {
        id: '',
        hour: '',
        activityTitle: '',
        duration: '',
        responsible: '',
      },
    ],
    selectedDate: '',
    ministerSelected: '',
    worshipTitle: '',
  },
};

export const PlannerContext = createContext();

export function PlannerProvider({ children }) {
  const [planner, setPanner] = useState(defaultPlanner);

  const variables = {
    planner,
    setPanner,
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
