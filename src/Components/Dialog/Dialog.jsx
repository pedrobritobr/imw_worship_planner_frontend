import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import './Dialog.css';

function Dialog({
  show,
  title,
  message,
  type = 'alert',
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  autoClose = true,
  autoCloseSeconds = 6,
}) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (show && autoClose) {
      setProgress(100);
    }
  }, [show, autoClose]);

  useEffect(() => {
    if (show && autoClose) {
      const start = Date.now();
      const duration = autoCloseSeconds * 1000;

      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const percentage = 100 - (elapsed / duration) * 100;
        setProgress(Math.max(percentage, 0));
        if (elapsed >= duration) {
          clearInterval(interval);
          onCancel();
        }
      }, 100);

      return () => {
        clearInterval(interval);
      };
    }
    return undefined;
  }, [show, autoClose, autoCloseSeconds, onCancel]);

  return (
    <CSSTransition
      in={show}
      timeout={150}
      classNames="modal-fade"
      unmountOnExit
    >
      <div className="Dialog">
        <div className="modal-content">
          {title && <h3>{title}</h3>}
          {message && (
            <p
              dangerouslySetInnerHTML={{ __html: message }}
            />
          )}
          <div className="modal-actions">
            {type === 'confirm' && onConfirm && (
              <button type="button" className="confirm-button" onClick={onConfirm}>
                {confirmText}
              </button>
            )}
            <button type="button" className="cancel-button" onClick={onCancel}>
              {type === 'confirm' ? cancelText : 'Fechar'}
            </button>
          </div>
        </div>
        <div className="progress-bar">
          {autoClose && (
            <div
              className="progress"
              style={{ width: `${progress}%` }}
            />
          )}
        </div>
      </div>
    </CSSTransition>
  );
}

Dialog.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(['confirm', 'alert', 'error']),
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  autoClose: PropTypes.bool,
  autoCloseSeconds: PropTypes.number,
};

Dialog.defaultProps = {
  title: '',
  message: '',
  type: 'confirm',
  onConfirm: undefined,
  onCancel: undefined,
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  autoClose: true,
  autoCloseSeconds: 6,
};

export default Dialog;
