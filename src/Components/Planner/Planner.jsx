import React, { useState } from 'react';
import './Planner.css';
import { getActualDate } from '../../helpers';

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
    <div>
      {getActualDate()}
      {entries.map((entry, index) => (
        <div key={index}>
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
          <input
            type="number"
            min={0}
            name="duration"
            value={entry.duration}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Duração"
          />
          <input
            type="text"
            name="responsible"
            value={entry.responsible}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Responsável"
          />
        </div>
      ))}
      <button type="button" onClick={handleAddEntry}>+</button>
      <div>
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
