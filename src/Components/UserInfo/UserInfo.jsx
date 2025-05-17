import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { UserContext } from '@/Context/UserContext';

import LogOutSVG from '@/assets/logout-svgrepo-com.svg';

import './UserInfo.css';

function UserInfo({ toggleMenu }) {
  const { user, logOut } = useContext(UserContext);

  const logOutUser = () => {
    logOut();
    toggleMenu();
  };

  return (
    <div className="UserInfo user-info">
      <p className="user_name">{user ? user.name : ''}</p>
      <p className="user_email">{user ? user.email : ''}</p>
      <p className="user_church">{user ? user.church : ''}</p>
      <button type="button" className="logOut" onClick={logOutUser}>
        <img src={LogOutSVG} alt="Encerra sessão" />
      </button>
    </div>
  );
}

UserInfo.propTypes = {
  menuOpen: PropTypes.bool,
  className: PropTypes.string,
  toggleMenu: PropTypes.func,
}.isRequired;

export default UserInfo;
