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

export default capitalizeFirstLetter;
