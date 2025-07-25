import React, { useContext } from 'react';
import { PlannerContext } from '@/Context/PlannerContext';

import {
  getWeekDay,
  parseDateToString,
  generateId,
} from '@/helpers';

import './WorshipForm.css';

export default function WorshipForm() {
  const { planner, setPlanner } = useContext(PlannerContext);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPlanner({ ...planner, [name]: value, id: generateId() });
  };

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
    setPlanner({ ...planner, selectedDate: newDate });
  };

  return (
    <form className="WorshipForm">
      <label htmlFor="churchNameInput" id="WorshipFormChurchName">
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
      <label htmlFor="worshipTitleInput" id="WorshipFormWorshipTitle">
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
      <label htmlFor="worshipDate" id="WorshipFormDate">
        <h4>{getWeekDay(planner.selectedDate)}</h4>
        <input
          type="date"
          id="worshipDate"
          name="selectedDate"
          value={parseDateToString(planner.selectedDate)}
          onChange={handleDateChange}
        />
      </label>
      <label htmlFor="ministerInput" id="WorshipFormMinister">
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
    </form>
  );
}
