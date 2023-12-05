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

const getActualDate = (options) => {
  const today = new Date();
  const optionsDef = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return capitalizeFirstLetter(today.toLocaleDateString('pt-BR', options || optionsDef));
};

const screenshotFilename = () => {
  const today = getActualDate({});
  return `imw_cronograma_${today.replaceAll('/', '_')}`;
};

const setHourForActivity = (horaBase, minutosASomar) => {
  const partesHoraBase = horaBase.split(':');
  const horasBase = +partesHoraBase[0];
  const minutosBase = +partesHoraBase[1];

  const totalMinutosBase = (horasBase * 60) + minutosBase + (+minutosASomar);

  const novasHoras = Math.floor(totalMinutosBase / 60);
  const novosMinutos = totalMinutosBase % 60;

  return `${String(novasHoras).padStart(2, '0')}:${String(novosMinutos).padStart(2, '0')}`;
};

const columnsHeader = [
  {
    text: 'Hora',
    style: {
      margin: '2px 20px 2px 10px',
    },
  },
  {
    text: 'Atividade',
    style: {
      margin: '2px 20px 2px 10px',
    },
  },
  {
    text: 'Duração',
    style: {
      margin: '2px 0px',
    },
  },
  {
    text: 'Responsável',
    style: {
      margin: '2px 20px 2px 10px',
    },
  },
];

const firstActivity = {
  hour: '19:00',
  activityTitle: 'Cronômetro',
  duration: '5',
  responsible: 'Rede Connect',
};
const lastActivity = {
  hour: '21:00',
  activityTitle: 'Encerramento',
  duration: '0',
  responsible: '--',
};
const defaultActivities = [firstActivity, lastActivity];

export {
  screenshotFilename,
  capitalizeFirstLetter,
  getActualDate,
  setHourForActivity,
  columnsHeader,
  defaultActivities,
};
