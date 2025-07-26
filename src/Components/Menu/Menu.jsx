import React, { useState, useEffect, useContext } from 'react';

import './Menu.css';

import { UserContext } from '@/Context/UserContext';
import { PageContext } from '@/Context/PageContext';
import { GuideTourContext } from '@/Context/GuideTourContext';

import useSharePlanner from '@/Components/SharePlanner';
import useUploadPlanner from '@/Components/UploadPlanner';
import useFetchPlanner from '@/Components/FetchPlanner';
import useLogout from '@/Components/Logout';

function Menu() {
  const { user } = useContext(UserContext);
  const {
    getUserPages,
    setCurrentPage,
    pages,
    currentPage,
  } = useContext(PageContext);
  const { openGuideTour } = useContext(GuideTourContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [userPages, setUserPages] = useState(getUserPages(user));
  const [loadingActions, setLoadingActions] = useState({});

  const [shouldShare, shareLink] = useSharePlanner();

  const [uploadPlanner] = useUploadPlanner();
  const [fetchPlanner] = useFetchPlanner();
  const [logout] = useLogout();

  const actions = {
    SharePlanner: () => {
      setLoadingActions((prev) => ({ ...prev, SharePlanner: true }));
      shouldShare();
      shareLink();
      setLoadingActions((prev) => ({ ...prev, SharePlanner: false }));
    },
    UploadPlanner: async () => {
      setLoadingActions((prev) => ({ ...prev, UploadPlanner: true }));
      await uploadPlanner();
      setLoadingActions((prev) => ({ ...prev, UploadPlanner: false }));
    },
    FetchPlanner: async () => {
      setLoadingActions((prev) => ({ ...prev, FetchPlanner: true }));
      await fetchPlanner();
      setLoadingActions((prev) => ({ ...prev, FetchPlanner: false }));
    },
    GuideTour: () => {
      const ignoreSeen = true;
      openGuideTour(ignoreSeen);
    },
    LogOut: () => {
      setLoadingActions((prev) => ({ ...prev, LogOut: true }));
      logout();
      setLoadingActions((prev) => ({ ...prev, LogOut: false }));
    },
  };

  useEffect(() => {
    setUserPages(getUserPages(user));
  }, [user]);

  const toggleMenu = () => {
    const hamburgerButton = document.querySelector('#hamburger-button');
    if (hamburgerButton) {
      hamburgerButton.classList.toggle('active');
    }
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    const userActionsElement = document.querySelector('.Menu');
    if (typeof event.target.className === 'string' && event.target.className.includes('introjs')) return;

    if (userActionsElement && !userActionsElement.contains(event.target)) {
      setMenuOpen(false);
      document.querySelector('#hamburger-button').classList.remove('active');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
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
        <button type="button" id="hamburger-button" className="plate plate5" onClick={toggleMenu} aria-label="Abrir/Fechar menu">
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
        </button>
      </div>
      <div className={`menu-container ${menuOpen ? 'open' : 'close'}`}>
        {
          Object.entries(userPages).map(([key, { title, icon }]) => (
            <button
              type="button"
              key={key}
              className={`menu-item${title === currentPage.title ? ' highlight' : ''}`}
              onClick={async () => {
                if (actions[key]) {
                  await actions[key]();
                } else {
                  setCurrentPage(pages[key]);
                }
                toggleMenu();
              }}
              disabled={!!loadingActions[key]}
            >
              <img src={icon} alt={title} />
              <span className={`menu-item-title menu-item-${key}`}>
                {title}
                {loadingActions[key] && <span className="loader" />}
              </span>
            </button>
          ))
        }
      </div>
    </div>
  );
}

export default Menu;
