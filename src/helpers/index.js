import { version as uuidVersion, validate as uuidValidate } from 'uuid';
import capitalizeFirstLetter from './stringUtils';

export * from '@/helpers/planner';
export * from '@/helpers/formPlanner';

const getLongDateString = (selectedDate) => {
  const optionsDef = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return capitalizeFirstLetter(selectedDate.toLocaleDateString('pt-BR', optionsDef));
};

const screenshotFilename = (churchName, selectedDate) => {
  const today = selectedDate.toLocaleDateString('pt-BR').split('T')[0];
  const todayFormatted = today.replaceAll('/', '_');
  const churchNameFormatted = churchName.replace(/ /g, '_').toLowerCase();
  const randomString = Math.floor(1000 + Math.random() * 9000).toString();

  return `cronograma_${churchNameFormatted}_${todayFormatted}_${randomString}`;
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
  { text: 'Hora' },
  { text: 'Atividade' },
  { text: 'Duração' },
  { text: 'Responsável' },
];

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

const scrollToTop = () => {
  window.scrollTo(0, 0);
};

const formatSelectedDateToUTC = (selectedDate) => {
  const selectedDateUTC = new Date(selectedDate);
  const minutesTimezoneOffset = selectedDateUTC.getTimezoneOffset();
  selectedDateUTC.setMinutes(selectedDateUTC.getMinutes() + minutesTimezoneOffset);
  return selectedDateUTC;
};

const validateUUID = (uuid) => {
  const isValidUUID = uuidValidate(uuid);
  const isValidVersion = uuidVersion(uuid) === 4;
  if (!(isValidUUID && isValidVersion)) throw new Error('Invalid UUID');
};

export {
  screenshotFilename,
  getLongDateString,
  setHourForActivity,
  formatMinutes,
  showErrorMessage,
  scrollToTop,
  formatSelectedDateToUTC,
  validateUUID,
  columnsHeader,
  pngConfigs,
};
