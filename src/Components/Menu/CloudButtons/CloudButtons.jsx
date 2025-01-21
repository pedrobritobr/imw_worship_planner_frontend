/* eslint-disable */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { UserContext } from '../../../Context/UserContext';

import DownloadSVG from "../../../assets/cloud-download-svgrepo-com.svg";
import UploadSVG from "../../../assets/cloud-upload-svgrepo-com.svg";

import { exportData, importData } from '../../../service';

import './CloudButtons.css';


function CloudButtons() {
  const { user } = useContext(UserContext);
  // const [userLocal, setUserLocal] = useState(userDefault);

  // const handleCloudButtons = (event) => {
  //   event.preventDefault();
  //   showErrorMessage('.cloud-buttons-error-message', '');

  //   const response = requestCloudButtons(userLocal);

  //   if (response.errorMsg) {
  //     showErrorMessage('.cloud-buttons-error-message', response.errorMsg);
  //   } else {
  //     setUserLocal(userDefault);
  //     setUser(userLocal);
  //   }
  // };

  return (
    <div className="CloudButtons">
      <button type="button" className="cloud-button" onClick={exportData}>
        <img src={UploadSVG} alt="Enviar os dados para nuvem" />
      </button>
      <button type="button" className="cloud-button" onClick={importData}>
        <img src={DownloadSVG} alt="Baixar os dados da nuvem" />
      </button>
    </div>
  );
}

CloudButtons.propTypes = {
  className: PropTypes.string,
}.isRequired;

export default CloudButtons;
