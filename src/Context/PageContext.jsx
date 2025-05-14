/* eslint-disable */
import React, { createContext, useState, useMemo } from 'react';

import PropTypes from 'prop-types';

import Main from '@/Components/Main';
import Login from '@/Components/Login';
import Register from '@/Components/Register';
import UserInfo from '@/Components/UserInfo';

export const PageContext = createContext();

export function PageProvider({ children }) {
  const pages = {
    Home: {
      title: 'Home',
      render: () => <Main />,
      icon: 'iconPath',
    },
    Login: {
      title: 'Login',
      render: () => <Login />,
      icon: 'iconPath',
    },
    Register: {
      title: 'Register',
      render: () => <Register />,
      icon: 'iconPath',
    },
    UserInfo: {
      title: 'UserInfo',
      render: () => <UserInfo className="UserInfo" />,
      icon: 'iconPath',
    },
    // Profile: () => <div>Profile</div>,
    // Settings: () => <div>Settings</div>,
    // Logout: () => <div>Logout</div>,
  }

  const [currentPage, setCurrentPage] = useState(pages.Home);

  const getPages = (user) => {
    if (!user) {
      return {
        Home: pages.Home,
        Login: pages.Login,
        Register: pages.Register,
      };
    }

    return {
      Home: pages.Home,
      UserInfo: pages.UserInfo,
    };
  };

  const variables = {
    getPages,
    currentPage,
    setCurrentPage: (newPage) => setCurrentPage(pages[newPage]),
  };

  const value = useMemo(() => (variables), Object.values(variables));

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
}

PageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
