import capitalizeFirstLetter from './stringUtils';

export const parseDateToString = (date) => {
  if (!date) return '';

  return date.toLocaleDateString('sv-SE');
};

export const getWeekDay = (day) => {
  const optionsDef = {
    weekday: 'long',
  };
  return capitalizeFirstLetter(day.toLocaleDateString('pt-BR', optionsDef));
};
