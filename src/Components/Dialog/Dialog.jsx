import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import './Dialog.css';

function Dialog({
  show,
  title,
  message,
  type = 'confirm',
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  autoClose = false,
  autoCloseTimeout = 5, // in seconds
}) {
  useEffect(() => {
    if (show && autoCloseTimeout) {
      const timer = setTimeout(() => {
        if (onCancel) onCancel();
      }, autoCloseTimeout * 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [show, autoCloseTimeout, onCancel]);

  return (
    <CSSTransition
      in={show}
      timeout={150}
      classNames="modal-fade"
      unmountOnExit
    >
      <div className={`confirmation-modal modal-${type}`}>
        <div className="modal-content">
          {title && <h3>{title}</h3>}
          {message && <p>{message}</p>}
          <div className="modal-actions">
            {type === 'confirm' && !autoClose && (
              <button type="button" className="confirm-button" onClick={onConfirm}>
                {confirmText}
              </button>
            )}
            <button type="button" className="cancel-button" onClick={onCancel}>
              {type === 'confirm' ? cancelText : 'Fechar'}
            </button>
          </div>
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
  autoCloseTimeout: PropTypes.number,
};

Dialog.defaultProps = {
  title: '',
  message: '',
  type: 'confirm',
  onConfirm: undefined,
  onCancel: undefined,
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  autoClose: false,
  autoCloseTimeout: undefined,
};

export default Dialog;
