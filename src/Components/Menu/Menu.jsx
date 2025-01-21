/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import './Menu.css';

import { UserContext } from '../../Context/UserContext';

import Login from './Login';
import Register from './Register';
import CloudButtons from './CloudButtons';
import UserInfo from './UserInfo';

function Menu() {
  const { user } = useContext(UserContext);
  const [isUserLogged, setIsUserValid] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.currentTarget.classList.toggle('active');
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    const userActionsElement = document.querySelector('.Menu');
    if (userActionsElement && !userActionsElement.contains(event.target)) {
      setMenuOpen(false);
      document.querySelector('#hamburger').classList.remove('active');
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
    <div className="Menu">
      <div className="hamburger">
        <svg>
          <defs>
            <filter id="gooeyness">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="gooeyness" />
              <feComposite in="SourceGraphic" in2="gooeyness" operator="atop" />
            </filter>
          </defs>
        </svg>
        <div id="hamburger" className="plate plate5" onClick={toggleMenu}>
          <svg className="burger" version="1.1" height="45" width="45" viewBox="0 0 100 100">
            <path className="line line1" d="M 30,35 H 70 " />
            <path className="line line2" d="M 50,50 H 30 L 34,32" />
            <path className="line line3" d="M 50,50 H 70 L 66,68" />
            <path className="line line4" d="M 30,65 H 70 " />
          </svg>
          <svg className="x" version="1.1" height="45" width="45" viewBox="0 0 100 100">
            <path className="line" d="M 34,32 L 66,68" />
            <path className="line" d="M 66,32 L 34,68" />
          </svg>
        </div>
      </div>
      <div className={`menu-container ${menuOpen ? 'open' : 'close'}`}>
        {!isUserLogged ? (
          <div className="user-not-logged">
            <Login className="menu-item" />
            <Register className="menu-item" />
          </div>
        ) : (
          <div className="user-logged">
            <UserInfo className="menu-item" />
            <CloudButtons className="menu-item" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
