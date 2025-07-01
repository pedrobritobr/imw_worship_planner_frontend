import React from 'react';
import Joyride from 'react-joyride';
import PropTypes from 'prop-types';

import './GuideTour.css';

const steps = [
  {
    target: '#AppName',
    content: 'Bem-vindo ao Cronograma de Culto! Aqui você pode planejar e compartilhar seus cultos.',
  },
  {
    target: '#ActionsButton',
    content: 'Clique aqui para criar, importar ou compartilhar um cronograma.',
  },
  // Adicione mais etapas conforme necessário, usando os ids dos elementos das novas funcionalidades
];

function GuideTour({ run, onClose }) {
  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      styles={{
        options: {
          zIndex: 10000,
        },
      }}
      callback={(data) => {
        if (data.status === 'finished' || data.status === 'skipped') {
          onClose();
        }
      }}
    />
  );
}

GuideTour.propTypes = {
  run: PropTypes.bool,
  onClose: PropTypes.func,
}.isRequired;

export default GuideTour;
