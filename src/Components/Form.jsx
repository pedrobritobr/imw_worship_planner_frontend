import React, { useState } from 'react';

const firstActivity =  { hour: '18:55', activityTitle: 'Cronômetro', duration: 5, responsible: 'Rede Connect' }
const lastActivity =  { hour: '21:00', activityTitle: 'Encerramento', duration: 0, responsible: '--' }
const emptyActivity =  { hour: '', activityTitle: '', duration: '', responsible: '' }

const Formulario = () => {
  const [entries, setEntries] = useState([firstActivity]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newEntries = [...entries];
    // newEntries[index][name] = value;
    newEntries[index] = { ...newEntries[index], [name]: value }; // Cria uma cópia profunda do objeto
    setEntries(newEntries);
  };

  const handleAddEntry = () => {
    setEntries([...entries, { ...emptyActivity }]); // Cria uma cópia profunda do objeto
  };
  const today = new Date();
  console.log(today)
  // const date = today.toLocaleDateString('pt-BR');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const nomeDiaSemana = today.toLocaleDateString('pt-BR', options);

  const capitalizeFirstLetter = (str) => {
    const capitalized = (word) => {
      if (word.length > 3) {
        return word[0].toUpperCase() + word.substr(1);
      }
      return word;
    };
  
    const strArray = str.split(' ');
  
    return strArray.map(capitalized).join(' ');
  };

  return (
    <div>
      {capitalizeFirstLetter(nomeDiaSemana)}
      {entries.map((entry, index) => (
        <div key={index} id={index}>
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
      <button onClick={handleAddEntry}>+</button>
      <div>
      <input
            type="time"
            name="hour"
            value={lastActivity.hour}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Hora"
            disabled
          />
          <input
            type="text"
            name="activityTitle"
            value={lastActivity.activityTitle}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Atividade"
            disabled
          />
          <input
            type="number"
            min={0}
            name="duration"
            value={lastActivity.duration}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Duração"
            disabled
          />
          <input
            type="text"
            name="responsible"
            value={lastActivity.responsible}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Responsável"
            disabled
          />
      </div>
    </div>
  );
};

export default Formulario;
