/* eslint-disable */
import _ from 'lodash';
import { v4, v5 } from 'uuid';

import { userDefault } from '@/Context/UserContext';

const getPlannerFromLocalStorage = () => {
  const stored = localStorage.getItem('planner');
  if (stored) {
    const parsed = JSON.parse(stored);
    parsed.selectedDate = new Date(parsed.selectedDate);
    return parsed;
  }
  return null;
};

const generateId = () => {
  const storedPlanner = getPlannerFromLocalStorage();
  if (storedPlanner) {
    const { churchName, worshipTitle, selectedDate } = storedPlanner;

    const baseString = `${churchName || ''}-${worshipTitle || ''}-${selectedDate || ''}`;
    console.log(baseString);

    return v5(baseString, 'f47ac10b-58cc-4372-a567-0e02b2c3d479'); // Use a fixed namespace UUID for consistency

    // // Use a simple hash function to generate a UUID-like string
    // let hash = 0;
    // for (let i = 0; i < baseString.length; i++) {
    //   hash = ((hash << 5) - hash) + baseString.charCodeAt(i);
    //   hash |= 0; // Convert to 32bit integer
    // }
    // // Convert hash to hex and format as UUID
    // const hex = Math.abs(hash).toString(16).padStart(32, '0').slice(0, 32);
    // return `${hex.substr(0,8)}-${hex.substr(8,4)}-${hex.substr(12,4)}-${hex.substr(16,4)}-${hex.substr(20,12)}`;
  }
  return v4();
};

export const emptyPlanner = () => ({
  id: generateId(),
  activities: [
    {
      id: 'firstActivity',
      hour: '19:00',
      activityTitle: 'Cronômetro',
      duration: '5',
      responsible: 'Rede Connect',
    },
    {
      id: 'lastActivity',
      hour: '21:00',
      activityTitle: 'Encerramento',
      duration: '0',
      responsible: '--',
    },
  ],
  selectedDate: new Date(),
  ministerSelected: '',
  worshipTitle: '',
  churchName: '',
  creator: userDefault,
});

export const getDefaultPlanner = () => {
  const stored = getPlannerFromLocalStorage();
  if (stored) return stored;

  return emptyPlanner();
};

export const validatePlanner = (planner, downloadedPlanner) => {
  const translatedFields = {
    activities: 'Atividades',
    ministerSelected: 'Ministro',
    worshipTitle: 'Título do Culto',
    churchName: 'Nome da Igreja',
  };

  const missingFields = Object.entries(translatedFields)
    .filter(([field]) => _.isEqual(planner[field], emptyPlanner()[field]))
    .map(([, label]) => label);

  if (missingFields.length) {
    return `Os seguintes campos não foram preenchidos:<br>- ${missingFields.join('<br>- ')}`;
  }

  if (_.isEqual(planner, downloadedPlanner)) {
    return 'Não houve mudanças entre o cronograma baixado/salvo e o cronograma atual';
  }

  return null;
};

export {
  generateId,
};
