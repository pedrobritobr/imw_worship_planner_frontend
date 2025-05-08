import React, {
  createContext,
  useState,
  useMemo,
  createRef,
} from 'react';
import { exportComponentAsPNG } from 'react-component-export-image';
import PropTypes from 'prop-types';

import {
  generateId,
  screenshotFilename,
  pngConfigs,
  scrollToTop,
} from '@/helpers';
import { uploadPlannerToCloud } from '@/service';

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

export const getDefaultPlanner = () => ({
  id: generateId(),
  activities: [firstActivity, lastActivity],
  selectedDate: new Date(),
  ministerSelected: '',
  worshipTitle: '',
  churchName: '',
  creator: userDefault,
});

export const PlannerContext = createContext();

export function PlannerProvider({ children }) {
  const ref = createRef();
  const [planner, setPlanner] = useState(getDefaultPlanner());
  const [downloadedPlanner, setDownloadedPlanner] = useState(getDefaultPlanner());
  const [isFetchingPlanner, setIsFetchingPlanner] = useState(false);

  const getPlanner = (p) => (Object.keys(p).length === 0 ? getDefaultPlanner() : p);

  const storePlanner = (newPlanner) => {
    const updatedPlanner = getPlanner(newPlanner);
    setPlanner(updatedPlanner);
    localStorage.setItem('planner', JSON.stringify(updatedPlanner));
  };

  const deletePlanner = () => {
    const defaultPlanner = getDefaultPlanner();
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
