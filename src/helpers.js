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

const getLongDateString = (selectedDate) => {
  const optionsDef = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return capitalizeFirstLetter(selectedDate.toLocaleDateString('pt-BR', optionsDef));
};

const getWeekDay = (day) => {
  const optionsDef = {
    weekday: 'long',
  };
  return capitalizeFirstLetter(day.toLocaleDateString('pt-BR', optionsDef));
};

const screenshotFilename = (selectedDate) => {
  const today = selectedDate.toLocaleDateString('pt-BR').split('T')[0];
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

const formatMinutes = (minutes) => Math.max(minutes, 0).toString().padStart(2, '0');

const columnsHeader = [
  {
    text: 'Hora',
    style: {
      // margin: '2px 20px 2px 10px',
    },
  },
  {
    text: 'Atividade',
    style: {
      // margin: '2px 20px 2px 10px',
    },
  },
  {
    text: 'Duração',
    style: {
      // margin: '2px 0px',
    },
  },
  {
    text: 'Responsável',
    style: {
      // margin: '2px 20px 2px 10px',
    },
  },
];

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
const defaultActivities = [firstActivity, lastActivity];

const pngConfigs = {
  html2CanvasOptions: {
    scale: 7,
    backgroundColor: '#02041B',
  },
};

const showErrorMessage = (element, message) => {
  const errorMessage = document.querySelector(element);
  errorMessage.textContent = message;
};

const showPassword = (elementId) => {
  const passwordInput = document.getElementById(elementId);
  passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
};

export {
  screenshotFilename,
  capitalizeFirstLetter,
  getLongDateString,
  getWeekDay,
  setHourForActivity,
  formatMinutes,
  showErrorMessage,
  showPassword,
  columnsHeader,
  defaultActivities,
  pngConfigs,
};
