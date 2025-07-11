import React, {
  createContext,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

const guide = {
  version: 1,
  steps: [
    {
      element: '.Menu .hamburger',
      intro: `
      <b>O Menu está de cara nova ✨</b>
      <p>
        Clique no ícone do menu para ver as novas opções.
      </p>`,
      title: '1/3',
    },
    {
      element: '.menu-container',
      intro: `
      Agora é possível
      <em>Compartilhar o cronograma</em>
      e
      <em>Enviar um feedback aos desenvolvedores</em>.
      `,
      title: '2/3',
    },
    {
      element: '.Main .download-button',
      intro: 'Ao baixar a imagem do cronograma, você poderá compartilhar diretamente o cronograma para onde desejar.',
      title: '3/3',
    },
  ],
};

export const GuideTourContext = createContext();

export function GuideTourProvider({ children }) {
  const [showGuideTour, setShowGuideTour] = useState(false);

  const openGuideTour = (ignoreSeen = true) => {
    let lastGuideSeen = localStorage.getItem('lastGuideSeen', '0');
    lastGuideSeen = parseInt(lastGuideSeen, 10);

    if (!ignoreSeen && lastGuideSeen >= guide.version) {
      return;
    }
    setShowGuideTour(true);
  };

  const closeGuideTour = () => {
    localStorage.setItem('lastGuideSeen', guide.version);
    setShowGuideTour(false);
  };

  const variables = {
    steps: guide.steps,
    showGuideTour,
    openGuideTour,
    closeGuideTour,
  };

  const value = useMemo(() => (variables), Object.values(variables));

  return (
    <GuideTourContext.Provider value={value}>
      {children}
    </GuideTourContext.Provider>
  );
}

GuideTourProvider.propTypes = {
  children: PropTypes.node,
}.isRequired;
