import React, {
  createContext,
  useState,
  useMemo,
  createRef,
} from 'react';
import { exportComponentAsPNG } from 'react-component-export-image';
import PropTypes from 'prop-types';

import {
  screenshotFilename,
  pngConfigs,
  scrollToTop,
  emptyPlanner,
} from '@/helpers';
import { uploadPlannerToCloud } from '@/service';

export const PlannerContext = createContext();

export function PlannerProvider({ children }) {
  const ref = createRef();
  const [planner, setPlanner] = useState(emptyPlanner());
  const [downloadedPlanner, setDownloadedPlanner] = useState(emptyPlanner());
  const [isFetchingPlanner, setIsFetchingPlanner] = useState(false);

  const getPlanner = (p) => (Object.keys(p).length === 0 ? emptyPlanner() : p);

  const storePlanner = (newPlanner) => {
    const updatedPlanner = getPlanner(newPlanner);
    setPlanner(updatedPlanner);
    localStorage.setItem('planner', JSON.stringify(updatedPlanner));
  };

  const deletePlanner = () => {
    const defaultPlanner = emptyPlanner();
    window.history.pushState({}, '', '/');
    localStorage.setItem('planner', JSON.stringify(defaultPlanner));
    setPlanner(defaultPlanner);
  };

  const storeDownloadedPlanner = (newPlanner) => {
    const updatedPlanner = getPlanner(newPlanner);
    setDownloadedPlanner(updatedPlanner);
  };

  const downloadPlanner = () => {
    scrollToTop();
    const { churchName, selectedDate } = planner;
    exportComponentAsPNG(ref, {
      fileName: screenshotFilename(churchName, selectedDate),
      ...pngConfigs,
    });

    try {
      const { creator, ...plannerWithoutCreator } = planner;
      uploadPlannerToCloud(plannerWithoutCreator);
    } catch (error) {
      console.error('Erro ao salvar cronograma no backend:', error);
    }
  };

  const variables = {
    planner,
    setPlanner: storePlanner,
    deletePlanner,
    downloadedPlanner,
    setDownloadedPlanner: storeDownloadedPlanner,
    ref,
    isFetchingPlanner,
    setIsFetchingPlanner,
    downloadPlanner,
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
