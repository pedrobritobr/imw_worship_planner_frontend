import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { UserContext } from '@/Context/UserContext';

import LogOutSVG from '@/assets/logout-svgrepo-com.svg';

function Logout() {
  const { logOut } = useContext(UserContext);

  return (
    <button type="button" className="logOut" onClick={logOut}>
      <img src={LogOutSVG} alt="Encerra sessão" />
    </button>
  );
}

Logout.propTypes = {
  toggleMenu: PropTypes.func,
}.isRequired;

export default Logout;
