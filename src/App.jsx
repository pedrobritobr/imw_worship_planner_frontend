import React, {
  useEffect,
  useRef,
  useContext,
  useState,
} from 'react';

import { exportComponentAsPNG } from 'react-component-export-image';

import Planner from './Components/Planner';
import ScreenshotTable from './Components/ScreenshotTable';
import ActionsButton from './Components/ActionsButton';
import Menu from './Components/Menu';

import { UserProvider, UserContext } from './Context/UserContext';
import { PlannerProvider, PlannerContext } from './Context/PlannerContext';

import { sendLocationToAnalytics } from './service';

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
  const [showTextOnPage, setShowTextOnPage] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    const x = {
      user,
      '!user.email': !user.email,
      storedUser,
    };

    setShowTextOnPage(JSON.stringify(x, null, 2));

    // if (!user.email && storedUser) {
    //   const userData = JSON.parse(storedUser);
    //   logIn(userData.token);
    // }
  }, [user, logIn]);

  useEffect(() => {
    const storedPlanner = JSON.parse(localStorage.getItem('planner'));

    if (!storedPlanner?.activities?.length) return;

    const storedActivityId = storedPlanner?.activities[1]?.id;
    const currentActivityId = planner?.activities[1]?.id;

    if (storedActivityId !== currentActivityId) {
      storedPlanner.selectedDate = new Date(storedPlanner.selectedDate);
      setPlanner(storedPlanner);
    }
  }, [planner, setPlanner]);

  useEffect(() => {
    sendLocationToAnalytics(document.title, window.location.href);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPlanner({ ...planner, [name]: value });
  };

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    newDate.setHours(newDate.getHours() + 3);
    setPlanner({ ...planner, selectedDate: newDate });
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  const downloadPlanner = () => {
    scrollToTop();
    const { churchName, selectedDate } = planner;
    exportComponentAsPNG(ref, {
      fileName: screenshotFilename(churchName, selectedDate),
      ...pngConfigs,
    });
  };

  return (
    <div className="App">
      <textarea value={showTextOnPage} readOnly style={{ color: 'black' }} />
      <header>
        <Menu />
        <h3>Roteiro de Culto</h3>
        <ActionsButton downloadPlanner={downloadPlanner} />
      </header>
      <div className="main">
        <label htmlFor="churchNameInput" id="worship-title-container">
          <h4> Igreja:</h4>
          <input
            type="text"
            id="churchNameInput"
            name="churchName"
            value={planner.churchName}
            onChange={handleInputChange}
            placeholder="Nome da igreja"
          />
        </label>
        <label htmlFor="worshipTitleInput" id="worship-title-container">
          <h4> Título do culto:</h4>
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
