import _ from 'lodash';
import { v4 as generateId } from 'uuid';

import { userDefault } from '@/Context/UserContext';

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
  const stored = localStorage.getItem('planner');
  if (stored) {
    const parsed = JSON.parse(stored);
    parsed.selectedDate = new Date(parsed.selectedDate);

    return parsed;
  }

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
