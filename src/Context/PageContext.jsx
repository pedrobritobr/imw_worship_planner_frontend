import React, { createContext, useState, useMemo } from 'react';

import PropTypes from 'prop-types';

import Main from '@/Components/Main';
import Login from '@/Components/Login';
import Register from '@/Components/Register';
import UserInfo from '@/Components/UserInfo';
import Feedback from '@/Components/Feedback';
import SharePlanner from '@/Components/SharePlanner';
import FetchPlanner from '@/Components/FetchPlanner';
import UploadPlanner from '@/Components/UploadPlanner';
import Logout from '@/Components/Logout';

export const PageContext = createContext();

export function PageProvider({ children }) {
  const pages = {
    Home: {
      id: 'Home',
      title: 'Home',
      render: () => <Main />,
      icon: 'iconPath',
    },
    Login: {
      id: 'Login',
      title: 'Entrar',
      render: () => <Login />,
      icon: 'iconPath',
    },
    Register: {
      id: 'Register',
      title: 'Cadastrar',
      render: () => <Register />,
      icon: 'iconPath',
    },
    UserInfo: {
      id: 'UserInfo',
      title: 'Usuário',
      render: () => <UserInfo />,
      icon: 'iconPath',
    },
    Feedback: {
      id: 'Feedback',
      title: 'Feedback',
      render: () => <Feedback />,
      icon: 'iconPath',
    },
    SharePlanner: {
      id: 'SharePlanner',
      title: 'Compartilhar Cronograma',
      render: () => <SharePlanner />,
      icon: 'iconPath',
    },
    FetchPlanner: {
      id: 'FetchPlanner',
      title: 'Buscar Cronograma',
      render: () => <FetchPlanner />,
      icon: 'iconPath',
    },
    UploadPlanner: {
      id: 'UploadPlanner',
      title: 'Enviar Cronograma',
      render: () => <UploadPlanner />,
      icon: 'iconPath',
    },
    LogOut: {
      id: 'LogOut',
      title: 'Sair',
      render: () => <Logout />,
      icon: 'iconPath',
    },
  };

  const [currentPage, setCurrentPage] = useState(pages.Home);

  const getUserPages = (user) => {
    const alwaysVisible = ['Home'];
    const guestOnly = ['Login', 'Register'];

    const excludeCurrent = (obj) => Object.fromEntries(
      Object.entries(obj).filter(([key]) => key !== currentPage.id),
    );

    if (!user) {
      const visibleKeys = [...alwaysVisible, ...guestOnly];
      const guestPages = Object.fromEntries(visibleKeys.map((key) => [key, pages[key]]));
      return excludeCurrent(guestPages);
    }

    const userPages = Object.fromEntries(
      Object.entries(pages)
        .filter(([key]) => !guestOnly.includes(key) || alwaysVisible.includes(key)),
    );
    return excludeCurrent(userPages);
  };

  const variables = {
    pages,
    getUserPages,
    currentPage,
    setCurrentPage,
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
