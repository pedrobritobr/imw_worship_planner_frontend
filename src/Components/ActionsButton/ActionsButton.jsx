import React from 'react';
import PropTypes from 'prop-types';

import trashBtnSvg from '../../assets/trash-bin-2-svgrepo-com.svg';
import downloadBtnSvg from '../../assets/download-square-svgrepo-com.svg';
import uploadBtnSvg from '../../assets/upload-square-svgrepo-com.svg';

import './ActionsButton.css';

const handleDeleteLocalStorage = () => {
  localStorage.removeItem('imwWorshipPlanner');
  window.location.reload();
};

function ActionsButton({
  importData,
  exportData,
}) {
  return (
    <div className="actions-button-container">
      <div className="import-export">
        <button type="button" className="cloud-button" onClick={exportData}>
          <img width={40} src={uploadBtnSvg} alt="Enviar os dados para nuvem" />
        </button>
        <button type="button" className="cloud-button" onClick={importData}>
          <img width={40} src={downloadBtnSvg} alt="Baixar os dados da nuvem" />
        </button>
      </div>
      <button type="button" onClick={handleDeleteLocalStorage}>
        <img width={35} src={trashBtnSvg} alt="Excluir chave do localStorage" />
      </button>
    </div>
  );
}

ActionsButton.propTypes = {
  importData: PropTypes.func,
  exportData: PropTypes.func,
}.isRequired;

export default ActionsButton;
