/* eslint-disable no-underscore-dangle */
// TODO add versao do guia e mostrar para o usuario apenas se o guia nao for visto
import { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import introJs from 'intro.js';

import 'intro.js/introjs.css';
import './GuideTour.css';

import { GuideTourContext } from '@/Context/GuideTourContext';

let lastElement = null;
let lastHandler = null;

function detachClick() {
  if (lastElement && lastHandler) {
    lastElement.removeEventListener('click', lastHandler);
    lastElement.style.cursor = '';
    lastElement = null;
    lastHandler = null;
  }
}

function GuideTour({ onClose }) {
  const { showGuideTour } = useContext(GuideTourContext);

  useEffect(() => {
    if (!showGuideTour) return undefined;

    const intro = introJs();
    intro.setOptions({
      steps,
      showProgress: false,
      showBullets: false,
      exitOnOverlayClick: true,
      nextLabel: 'Próximo',
      prevLabel: 'Voltar',
      doneLabel: 'Concluir',
      skipLabel: 'Pular',
    });

    function clickHandlerFactory(ignoreClick) {
      return function handler(e) {
        if (ignoreClick) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        setTimeout(() => {}, 500);
        detachClick();
        intro.nextStep();
      };
    }

    function attachClick() {
      detachClick();
      const currentStep = intro._currentStep;
      const { element, ignoreClick = false } = steps[currentStep];
      if (!element) return;
      const el = document.querySelector(element);
      if (el) {
        el.style.cursor = 'pointer';
        lastHandler = clickHandlerFactory(ignoreClick);
        el.addEventListener('click', lastHandler);
        lastElement = el;
      }
    }

    intro._introItems = steps;
    intro.onbeforechange(() => { if (lastElement) lastElement.classList.remove('introjs-element-active'); });
    intro.onafterchange(() => { if (lastElement) lastElement.classList.add('introjs-element-active'); });

    setTimeout(() => {
      const nextBtn = document.querySelector('.introjs-nextbutton');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const currentStep = intro._currentStep;
          if (currentStep < 1 || currentStep > steps.length) return;

          const { element } = steps[currentStep - 1];
          if (element) {
            const el = document.querySelector(element);
            if (el.tagName === 'DIV') {
              const btn = el.querySelector('button, [role=button]');
              if (btn) btn.click();
            } else {
              el.click();
            }
          }
        });
      }
    }, 0);

    intro.onbeforechange(detachClick);
    intro.onafterchange(attachClick);
    intro.onexit(() => {
      detachClick();
      onClose();
    });
    intro.oncomplete(() => {
      detachClick();
      onClose();
    });
    intro.start();

    return () => {
      intro.exit();
      detachClick();
    };
  }, [run]);

  return null;
}

GuideTour.propTypes = {
  onClose: PropTypes.func,
}.isRequired;

export default GuideTour;
