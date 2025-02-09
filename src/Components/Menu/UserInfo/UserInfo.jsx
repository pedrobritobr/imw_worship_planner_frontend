import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { UserContext } from '../../../Context/UserContext';
import { PlannerContext, defaultPlanner } from '../../../Context/PlannerContext';

import { uploadPlannerToCloud, downloadPlannerFromCloud } from '../../../service';
import { formatSelectedDateToUTC } from '../../../helpers';

import HideUserSVG from '../../../assets/hide-user-svgrepo-com.svg';
import ShowUserSVG from '../../../assets/show-user-svgrepo-com.svg';
import DownloadSVG from '../../../assets/cloud-download-svgrepo-com.svg';
import UploadSVG from '../../../assets/cloud-upload-svgrepo-com.svg';
import UploadBackgroundSVG from '../../../assets/cloud-upload-background-svgrepo-com.svg';
import DownloadBackgroundSVG from '../../../assets/cloud-download-background-svgrepo-com.svg';
import LogOutSVG from '../../../assets/logout-svgrepo-com.svg';

import './UserInfo.css';

function UserInfo({ menuOpen }) {
  const { user, logOut } = useContext(UserContext);
  const {
    planner,
    setPlanner,
    downloadedPlanner,
    setDownloadedPlanner,
  } = useContext(PlannerContext);
  const [showInfo, setShowInfo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!menuOpen) setShowInfo(false);
  }, [menuOpen]);

  const handleButtonClick = () => {
    setShowInfo(!showInfo);
  };

  const validatePlanner = () => {
    const translatedFields = {
      activities: 'Atividades',
      ministerSelected: 'Ministro',
      worshipTitle: 'Título do Culto',
      churchName: 'Nome da Igreja',
    };

    const missingFields = Object.entries(translatedFields)
      .filter(([field]) => _.isEqual(planner[field], defaultPlanner[field]))
      .map(([, label]) => label);

    if (missingFields.length) {
      return `Os seguintes campos não foram preenchidos:\n- ${missingFields.join('\n- ')}`;
    }

    if (_.isEqual(planner, downloadedPlanner)) {
      return 'Não houve mudanças entre o cronograma baixado/enviado e o cronograma atual';
    }

    return null;
  };

  const uploadPlanner = async () => {
    const { alert } = window;
    const isValidPlanner = validatePlanner();
    if (isValidPlanner) return alert(isValidPlanner);

    setIsUploading(true);

    const { creator, ...plannerWithoutCreator } = planner;
    await uploadPlannerToCloud(plannerWithoutCreator, user.token);
    alert('Cronograma enviado com sucesso!');

    setIsUploading(false);
    setDownloadedPlanner(planner);
    return null;
  };

  const getPlanner = async () => {
    setIsDownloading(true);

    const plannerFromCloud = await downloadPlannerFromCloud(user.token);
    plannerFromCloud.selectedDate = formatSelectedDateToUTC(plannerFromCloud.selectedDate);

    setIsDownloading(false);
    setPlanner(plannerFromCloud);
    setDownloadedPlanner(plannerFromCloud);
  };

  const loaderContainer = (loaderSVG, altText) => (
    <div className="loader-container">
      <img src={loaderSVG} alt={altText} className="loader-bg" />
      <span className="loader" />
    </div>
  );

  return (
    <div className="UserInfo">
      <div className="user-buttons">
        <button className="show-user-info" type="button" onClick={handleButtonClick}>
          {
            showInfo
              ? <img src={HideUserSVG} alt="Ocultar informações do usuário" />
              : <img src={ShowUserSVG} alt="Exibir informações do usuário" />
          }
        </button>
        <button type="button" className="cloud-button" onClick={uploadPlanner}>
          {
            isUploading
              ? loaderContainer(UploadBackgroundSVG, 'Enviar os dados para nuvem')
              : <img src={UploadSVG} alt="Enviar os dados para nuvem" />
          }
        </button>
        <button type="button" className="cloud-button" onClick={getPlanner}>
          {
            isDownloading
              ? loaderContainer(DownloadBackgroundSVG, 'Baixar os dados para nuvem')
              : <img src={DownloadSVG} alt="Baixar os dados da nuvem" />
          }
        </button>
      </div>

      <div className={`user-info ${showInfo ? 'show' : 'hide'}`}>
        <button type="button" className="logOut" onClick={logOut}>
          <img src={LogOutSVG} alt="Encerra sessão" />
        </button>
        <p className="user_name">{user.name}</p>
        <p className="user_email">{user.email}</p>
        <p className="user_church">{user.church}</p>
      </div>
    </div>
  );
}

UserInfo.propTypes = {
  menuOpen: PropTypes.bool,
}.isRequired;

export default UserInfo;
