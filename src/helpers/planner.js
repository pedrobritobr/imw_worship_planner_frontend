import _ from 'lodash';
import { v4 as generateId } from 'uuid';

import { userDefault } from '@/Context/UserContext';

export const getDefaultPlanner = () => {
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

  return {
    id: generateId(),
    activities: [firstActivity, lastActivity],
    selectedDate: new Date(),
    ministerSelected: '',
    worshipTitle: '',
    churchName: '',
    creator: userDefault,
  };
};

export const validatePlanner = (planner, downloadedPlanner) => {
  const translatedFields = {
    activities: 'Atividades',
    ministerSelected: 'Ministro',
    worshipTitle: 'Título do Culto',
    churchName: 'Nome da Igreja',
  };

  const missingFields = Object.entries(translatedFields)
    .filter(([field]) => _.isEqual(planner[field], getDefaultPlanner()[field]))
    .map(([, label]) => label);

  if (missingFields.length) {
    return `Os seguintes campos não foram preenchidos:\n- ${missingFields.join('\n- ')}`;
  }

  if (_.isEqual(planner, downloadedPlanner)) {
    return 'Não houve mudanças entre o cronograma baixado/salvo e o cronograma atual';
  }

  return null;
};

export {
  generateId,
};
