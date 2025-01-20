import React, { useState, useContext } from 'react';
import './UserInfo.css';

import { UserContext } from '../../../Context/UserContext';
import HideUserSVG from '../../../assets/hide-user-svgrepo-com.svg';
import ShowUserSVG from '../../../assets/show-user-svgrepo-com.svg';

function UserInfo() {
  const { user, logOut } = useContext(UserContext);
  const [showInfo, setShowInfo] = useState(false);

  const handleButtonClick = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="UserInfo">
      <button className="user" type="button" onClick={handleButtonClick}>
        {
          showInfo
            ? <img src={HideUserSVG} alt="Ocultar informações do usuário" />
            : <img src={ShowUserSVG} alt="Exibir informações do usuário" />
        }
      </button>
      {showInfo && (
        <div>
          <button className="logOut" type="button" onClick={logOut}>Sair</button>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.church}</p>
        </div>
      )}
    </div>
  );
}

export default UserInfo;
