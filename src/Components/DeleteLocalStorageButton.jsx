import React from 'react';

import trashBtnSvg from '../assets/trash-bin-2-svgrepo-com.svg';

function DeleteLocalStorageButton() {
  const handleDeleteLocalStorage = () => {
    localStorage.removeItem('imwWorshipPlanner');
    window.location.reload();
  };

  const buttonStyle = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  };
  return (
    <button type="button" style={buttonStyle} onClick={handleDeleteLocalStorage}>
      <img width={35} src={trashBtnSvg} alt="Excluir chave do localStorage" />
    </button>
  );
}

export default DeleteLocalStorageButton;
