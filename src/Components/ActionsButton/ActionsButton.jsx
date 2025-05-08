import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import saveImageBtnSvg from '@/assets/image-svgrepo-com.svg';
import addBtnSvg from '@/assets/add-square-svgrepo-com.svg';

import { PlannerContext } from '@/Context/PlannerContext';

import './ActionsButton.css';

function ActionsButton() {
  const { downloadPlanner, deletePlanner } = useContext(PlannerContext);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  return (
    <div className="ActionsButton">
      <div className="actions-button-container">
        <button type="button" className="download-button" onClick={downloadPlanner}>
          <img src={saveImageBtnSvg} alt="Baixar Cronograma" />
        </button>
        <button type="button" onClick={() => setShowConfirmationModal(true)}>
          <img src={addBtnSvg} alt="Cria novo roteiro de culto" />
        </button>
      </div>

      {showConfirmationModal && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h3>Deseja criar um novo roteiro?</h3>
            <p>Essa ação excluirá todas as atividades na página e não poderá ser desfeita.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="confirm-button"
                onClick={() => {
                  deletePlanner();
                  setShowConfirmationModal(false);
                }}
              >
                Confirmar
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowConfirmationModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ActionsButton.propTypes = {
  downloadPlanner: PropTypes.func,
}.isRequired;

export default ActionsButton;
