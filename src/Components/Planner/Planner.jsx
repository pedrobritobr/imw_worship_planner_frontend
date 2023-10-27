import React, { useState } from 'react';
import { getActualDate } from '../../helpers';

import './Planner.css';
import plusSvg from '../../assets/plus.svg';

const columnsHeader = ['Hora', 'Atividade', 'Duração', 'Responsável'];
const firstActivity = {
  hour: '18:55',
  activityTitle: 'Cronômetro',
  duration: 5,
  responsible: 'Rede Connect',
};
const lastActivity = {
  hour: '21:00',
  activityTitle: 'Encerramento',
  duration: 0,
  responsible: '--',
};
const emptyActivity = {
  hour: '',
  activityTitle: '',
  duration: '',
  responsible: '',
};

function Planner() {
  const [entries, setEntries] = useState([firstActivity]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [name]: value };
    setEntries(newEntries);
  };

  const handleAddEntry = () => {
    setEntries([...entries, { ...emptyActivity }]);
  };

  return (
    <div className="planner-container">
      <h3>{getActualDate()}</h3>
      <div className="planner-headers">
        {columnsHeader.map((header) => (
          <h4>
            {header}
          </h4>
        ))}
      </div>
      {entries.map((entry, index) => (
        <div key={index} className="planner-activity-row">
          <input
            type="time"
            name="hour"
            value={entry.hour}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Hora"
          />
          <input
            type="text"
            name="activityTitle"
            value={entry.activityTitle}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Atividade"
          />
          <div className="duration-input">
            <input
              type="number"
              min={0}
              name="duration"
              value={entry.duration}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Duração"
            />
            <p>
              min
            </p>
          </div>
          <input
            type="text"
            name="responsible"
            value={entry.responsible}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Responsável"
          />
        </div>
      ))}
      <button type="button" className="ignore-on-print" onClick={handleAddEntry}>
        <img width={15} src={plusSvg} alt="Adiciona nova atividade" />
      </button>
      <div className="planner-activity-row">
        <input
          type="time"
          name="hour"
          value={lastActivity.hour}
          placeholder="Hora"
          disabled
        />
        <input
          type="text"
          name="activityTitle"
          value={lastActivity.activityTitle}
          placeholder="Atividade"
          disabled
        />
        <input
          type="number"
          min={0}
          name="duration"
          value={lastActivity.duration}
          placeholder="Duração"
          disabled
        />
        <input
          type="text"
          name="responsible"
          value={lastActivity.responsible}
          placeholder="Responsável"
          disabled
        />
      </div>
    </div>
  );
}

export default Planner;
