/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import './UserInfo.css';

import { UserContext } from '../../../Context/UserContext';
import { PlannerContext } from '../../../Context/PlannerContext';

import { uploadPlannerToCloud, downloadPlannerFromCloud } from '../../../service';

import HideUserSVG from '../../../assets/hide-user-svgrepo-com.svg';
import ShowUserSVG from '../../../assets/show-user-svgrepo-com.svg';
import DownloadSVG from '../../../assets/cloud-download-svgrepo-com.svg';
import UploadSVG from '../../../assets/cloud-upload-svgrepo-com.svg';
import LogOutSVG from '../../../assets/logout-svgrepo-com.svg';

function UserInfo({ menuOpen }) {
  const { user, logOut } = useContext(UserContext);
  const { setPlanner } = useContext(PlannerContext);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!menuOpen) setShowInfo(false);
  }, [menuOpen]);

  const handleButtonClick = () => {
    setShowInfo(!showInfo);
  };

  const getPlanner = async () => {
    const planner = await downloadPlannerFromCloud(user.token);
    planner.selectedDate = new Date(planner.selectedDate);
    setPlanner(planner);
  };

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
        <button type="button" className="cloud-button" onClick={() => uploadPlannerToCloud(user.token)}>
          <img src={UploadSVG} alt="Enviar os dados para nuvem" />
        </button>
        <button type="button" className="cloud-button" onClick={getPlanner}>
          <img src={DownloadSVG} alt="Baixar os dados da nuvem" />
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
