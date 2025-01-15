/*eslint-disable */
import React, { useState, useEffect } from 'react';
import './UserActions.css';

import Login from './Login';
import Register from "./Register";

const UserActions = () => {
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="user-actions">
      <button className="hamburger" onClick={toggleMenu}>
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button>
      <div className={`menu ${menuOpen ? 'open' : 'close'}`}>
        <Login className="menu-item"/>
        <Register className="menu-item"/>
      </div>
    </div>
  );
};

export default UserActions;




