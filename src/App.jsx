/* eslint-disable */

import React, { useEffect, useRef, useState, useContext } from 'react';

import { exportComponentAsPNG } from 'react-component-export-image';

import Planner from './Components/Planner';
import ScreenshotTable from './Components/ScreenshotTable';
import ActionsButton from './Components/ActionsButton';
import Menu from './Components/Menu';

import { UserProvider, UserContext } from './Context/UserContext';
import { PlannerProvider, PlannerContext } from './Context/PlannerContext';

import { sendLocationToAnalytics } from './service'

import {
  getWeekDay,
  screenshotFilename,
  pngConfigs,
  scrollToTop,
} from './helpers';

import './App.css';

function AppContent() {
  const { user, logIn } = useContext(UserContext);
  const { planner, setPlanner } = useContext(PlannerContext);

  useEffect(() => {
    const userLocalStorage = localStorage.getItem('user');

    if (!user.email && userLocalStorage) {
      const userData = JSON.parse(userLocalStorage);
      logIn(userData.token);
    }
  }, [user, logIn]);

  const ref = useRef(null);
  const [showScreeshotTable, setShowScreeshotTable] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPlanner({ ...planner, [name]: value });
  }

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    newDate.setHours(newDate.getHours() + 3);
    setPlanner({ ...planner, selectedDate: newDate });
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  useEffect(() => {
    // sendLocationToAnalytics(document.title, window.location.href);
  }, []);

  const downloadPlanner = () => {
    // setShowScreeshotTable(true);
    scrollToTop();
    const { churchName, selectedDate } = planner;
    exportComponentAsPNG(ref, {
      fileName: screenshotFilename(churchName, selectedDate),
      ...pngConfigs
    });
    // setShowScreeshotTable(false);
  };

  return (
    <div className="App">
      <header>
        <Menu />
        <h3>Roteiro de Culto</h3>
        <ActionsButton downloadPlanner={downloadPlanner} />
      </header>
      <div className="main">
        <label htmlFor="worshipTitleInput" id="worship-title-container">
          <input
            type="text"
            id="churchNameInput"
            name="churchName"
            value={planner.churchName}
            onChange={handleInputChange}
            placeholder="Nome da igreja"
          />
          <input
            type="text"
            id="worshipTitleInput"
            name="worshipTitle"
            value={planner.worshipTitle}
            onChange={handleInputChange}
            placeholder="Título do culto"
          />
        </label>
        <label htmlFor="customDateInput">
          <input
            type="date"
            id="customDateInput"
            name="selectedDate"
            value={formatDate(planner.selectedDate)}
            onChange={handleDateChange}
          />
          <h4>{getWeekDay(planner.selectedDate)}</h4>
        </label>
        <label htmlFor="ministerInput">
          <h4> Ministro:</h4>
          <input
            type="text"
            id="ministerInput"
            name="ministerSelected"
            value={planner.ministerSelected}
            onChange={handleInputChange}
            placeholder="Nome do ministro"
          />
        </label>
        <Planner />
      </div>
      <button type="button" className="download-button" onClick={downloadPlanner}>
        Baixar Cronograma
      </button>
      <div className="hidden">
        <div className="screenshot-table-container" ref={ref}>
          <ScreenshotTable />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <PlannerProvider>
        <AppContent />
      </PlannerProvider>
    </UserProvider>
  );
}

export default App;
