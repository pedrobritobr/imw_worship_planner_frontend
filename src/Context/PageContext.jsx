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
      title: 'Home',
      render: () => <Main />,
      icon: 'iconPath',
    },
    Login: {
      title: 'Entrar',
      render: () => <Login />,
      icon: 'iconPath',
    },
    Register: {
      title: 'Cadastrar',
      render: () => <Register />,
      icon: 'iconPath',
    },
    UserInfo: {
      title: 'Usuário',
      render: () => <UserInfo />,
      icon: 'iconPath',
    },
    Feedback: {
      title: 'Feedback',
      render: () => <Feedback />,
      icon: 'iconPath',
    },
    SharePlanner: {
      title: 'Compartilhar Cronograma',
      render: () => <SharePlanner />,
      icon: 'iconPath',
    },
    FetchPlanner: {
      title: 'Buscar Cronograma',
      render: () => <FetchPlanner />,
      icon: 'iconPath',
    },
    UploadPlanner: {
      title: 'Enviar Cronograma',
      render: () => <UploadPlanner />,
      icon: 'iconPath',
    },
    LogOut: {
      title: 'Sair',
      render: () => <Logout />,
      icon: 'iconPath',
    },
  };

  const [currentPage, setCurrentPage] = useState(pages.Home);

  const getUserPages = (user) => {
    const alwaysVisible = ['Home'];
    const guestOnly = ['Login', 'Register'];

    if (!user) {
      const visibleKeys = [...alwaysVisible, ...guestOnly];
      return Object.fromEntries(visibleKeys.map((key) => [key, pages[key]]));
    }

    return Object.fromEntries(
      Object.entries(pages)
        .filter(([key]) => !guestOnly.includes(key) || alwaysVisible.includes(key)),
    );
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
