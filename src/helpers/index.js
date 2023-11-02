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

export {
  screenshotFilename,
  capitalizeFirstLetter,
  getActualDate,
};
