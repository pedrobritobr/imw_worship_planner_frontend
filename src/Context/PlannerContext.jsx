import React, {
  createContext,
  useState,
  useMemo,
  createRef,
} from 'react';

import html2canvas from 'html2canvas';
import PropTypes from 'prop-types';

import {
  screenshotFilename,
  scrollToTop,
  emptyPlanner,
  share,
  updatePlannerID,
} from '@/helpers';
import { postPlanner } from '@/service';

export const PlannerContext = createContext();

export function PlannerProvider({ children }) {
  const ref = createRef();
  const [planner, setPlanner] = useState(emptyPlanner());
  const [downloadedPlanner, setDownloadedPlanner] = useState(emptyPlanner());
  const [isFetchingPlanner, setIsFetchingPlanner] = useState(false);

  const getPlanner = (p) => (Object.keys(p).length === 0 ? emptyPlanner() : p);

  const storePlanner = (newPlanner) => {
    const updatedPlanner = getPlanner(newPlanner);
    updatedPlanner.id = updatePlannerID(updatedPlanner);
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

  const downloadPlanner = async () => {
    if (!ref.current) return null;
    try {
      const screenshotContainer = document.querySelector('.screenshot-table-container');
      scrollToTop();

      const { creator, ...plannerWithoutCreator } = planner;
      postPlanner(plannerWithoutCreator);

      const { churchName, selectedDate } = planner;
      const canvas = await html2canvas(ref.current, {
        scale: 7,
        windowWidth: 0,
        width: screenshotContainer.offsetWidth,
        height: screenshotContainer.offsetHeight - 1,
        allowTaint: true,
      });

      const blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png');
      });

      const file = new File(
        [blob],
        screenshotFilename(churchName, selectedDate),
        { type: blob.type },
      );

      if (file) {
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        share({ files: [file] });
      }

    } catch (e) {
      console.error(e);
    }
    return null;
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
