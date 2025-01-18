/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import './UserActions.css';

import { UserContext } from '../../Context/UserContext';

import Login from './Login';
import Register from './Register';

function UserActions() {
  const { user } = useContext(UserContext);
  const [isUserLogged, setIsUserValid] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    const userActionsElement = document.querySelector('.user-actions');
    if (userActionsElement && !userActionsElement.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const isUserLogged = !!user.email && !!user.church;
    setIsUserValid(isUserLogged);
  }
  , [user]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="UserActions">
      <button type="button" className="hamburger" aria-label="hamburguer-menu" onClick={toggleMenu}>
        <span className="line" />
        <span className="line" />
        <span className="line" />
      </button>
      <div className={`menu ${menuOpen ? 'open' : 'close'}`}>
        {!isUserLogged ? (
          <>
            <Login className="menu-item" />
            <Register className="menu-item" />
          </>
        ) : (
          <div className="menu-item">
            <p>{user.email}</p>
            <p>{user.church}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserActions;
