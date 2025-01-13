import React from 'react';
import PropTypes from 'prop-types';

import trashBtnSvg from '../../assets/trash-bin-2-svgrepo-com.svg';
import downloadBtnSvg from '../../assets/cloud-download-svgrepo-com.svg';
import uploadBtnSvg from '../../assets/cloud-upload-svgrepo-com.svg';
import saveImageBtnSvg from '../../assets/image-svgrepo-com.svg';

import './ActionsButton.css';

const handleDeleteLocalStorage = () => {
  localStorage.removeItem('imwWorshipPlanner');
  window.location.reload();
};

function ActionsButton({
  importData,
  exportData,
  setShowScreeshotTable,
}) {
  return (
    <div className="actions-button-container">
      <div className="cloud-button">
        <button type="button" className="cloud-button" onClick={exportData}>
          <img src={uploadBtnSvg} alt="Enviar os dados para nuvem" />
        </button>
        <button type="button" className="cloud-button" onClick={importData}>
          <img src={downloadBtnSvg} alt="Baixar os dados da nuvem" />
        </button>
      </div>
      <div className="local-button">
        <button type="button" className="download-button" onClick={() => setShowScreeshotTable(true)}>
          <img src={saveImageBtnSvg} alt="Baixar Cronograma" />
        </button>
        <button type="button" onClick={handleDeleteLocalStorage}>
          <img src={trashBtnSvg} alt="Excluir chave do localStorage" />
        </button>
      </div>
    </div>
  );
}

ActionsButton.propTypes = {
  importData: PropTypes.func,
  exportData: PropTypes.func,
  setShowScreeshotTable: PropTypes.func,
}.isRequired;

export default ActionsButton;
