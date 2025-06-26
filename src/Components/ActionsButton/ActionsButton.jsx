import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import saveImageBtnSvg from '@/assets/image-svgrepo-com.svg';
import addBtnSvg from '@/assets/add-square-svgrepo-com.svg';

import { PlannerContext } from '@/Context/PlannerContext';
import { useDialog } from '@/Context/DialogContext';

import './ActionsButton.css';

function ActionsButton() {
  const { downloadPlanner, deletePlanner } = useContext(PlannerContext);
  const { showDialog } = useDialog();

  const handleNewPlanner = () => {
    showDialog({
      show: true,
      type: 'confirm',
      title: 'Deseja criar um novo roteiro?',
      message: 'Essa ação excluirá todas as atividades na página e não poderá ser desfeita.',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        deletePlanner();
      },
    });
  };

  return (
    <div className="ActionsButton">
      <div className="actions-button-container">
        <button type="button" className="download-button" onClick={downloadPlanner}>
          <img src={saveImageBtnSvg} alt="Baixar Cronograma" />
        </button>
        <button type="button" onClick={handleNewPlanner}>
          <img src={addBtnSvg} alt="Cria novo roteiro de culto" />
        </button>
      </div>
    </div>
  );
}

ActionsButton.propTypes = {
  downloadPlanner: PropTypes.func,
}.isRequired;

export default ActionsButton;
