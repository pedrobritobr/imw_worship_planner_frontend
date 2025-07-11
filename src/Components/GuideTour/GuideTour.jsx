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

function applyFixLeft() {
  const helperLayer = document.querySelector('.introjs-helperLayer');
  const tooltipReferenceLayer = document.querySelector('.introjs-tooltipReferenceLayer');

  if (!helperLayer || !tooltipReferenceLayer) return;

  const currentLeft = parseInt(getComputedStyle(helperLayer).left, 10);

  if (currentLeft <= 0) {
    helperLayer.classList.add('introjs-fix-left');
    tooltipReferenceLayer.classList.add('introjs-fix-left');
  } else {
    helperLayer.classList.remove('introjs-fix-left');
    tooltipReferenceLayer.classList.remove('introjs-fix-left');
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function GuideTour() {
  const {
    steps,
    showGuideTour,
    closeGuideTour,
  } = useContext(GuideTourContext);

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
        }
        detachClick();
        intro.nextStep();
      };
    }

    function attachClick() {
      detachClick();
      const currentStep = intro._currentStep;
      const { element, ignoreClick } = steps[currentStep];
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
      closeGuideTour();
    });
    intro.oncomplete(() => {
      detachClick();
      closeGuideTour();
    });
    intro.start();

    return () => {
      intro.exit();
      detachClick();
    };
  }, [showGuideTour]);

  useEffect(() => {
    if (!showGuideTour) return undefined;

    const debouncedApplyFixLeft = debounce(applyFixLeft, 0);
    let observer = null;

    const waitForElements = () => {
      const helperLayer = document.querySelector('.introjs-helperLayer');
      const tooltipReferenceLayer = document.querySelector('.introjs-tooltipReferenceLayer');

      if (helperLayer && tooltipReferenceLayer) {
        applyFixLeft();

        if (window.ResizeObserver) {
          observer = new ResizeObserver(debouncedApplyFixLeft);
          observer.observe(helperLayer);
          observer.observe(tooltipReferenceLayer);
          observer.observe(document.body);
        } else {
          observer = setInterval(debouncedApplyFixLeft, 0);
        }
      } else {
        setTimeout(waitForElements, 0);
      }
    };

    waitForElements();

    return () => {
      if (observer instanceof ResizeObserver) {
        observer.disconnect();
      } else if (observer) {
        clearInterval(observer);
      }
    };
  }, [showGuideTour]);

  return null;
}

GuideTour.propTypes = {
  onClose: PropTypes.func,
}.isRequired;

export default GuideTour;
