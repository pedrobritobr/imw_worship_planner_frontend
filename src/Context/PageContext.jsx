import React, { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import Main from '@/Components/Main';
import Login from '@/Components/Login';
import Register from '@/Components/Register';
import UserInfo from '@/Components/UserInfo';
import Feedback from '@/Components/Feedback';

import HomeIcon from '@/assets/icons/home.svg';
import SignIn from '@/assets/icons/signin.svg';
import SignUp from '@/assets/icons/signup.svg';
import FeedbackIcon from '@/assets/icons/feedback.svg';
import SharePlannerIcon from '@/assets/icons/share.svg';
import LogOutIcon from '@/assets/icons/logout.svg';
import UserIcon from '@/assets/icons/user.svg';
import UploadIcon from '@/assets/icons/upload.svg';
import DownloadIcon from '@/assets/icons/download.svg';

export const PageContext = createContext();

export function PageProvider({ children }) {
  const pages = {
    Home: {
      id: 'Home',
      title: 'Início',
      render: () => <Main />,
      icon: HomeIcon,
    },
    Login: {
      id: 'Login',
      title: 'Entrar',
      render: () => <Login />,
      icon: SignIn,
    },
    Register: {
      id: 'Register',
      title: 'Cadastrar',
      render: () => <Register />,
      icon: SignUp,
    },
    SharePlanner: {
      id: 'SharePlanner',
      title: 'Compartilhar Cronograma',
      icon: SharePlannerIcon,
    },
    UploadPlanner: {
      id: 'UploadPlanner',
      title: 'Salvar Cronograma',
      icon: UploadIcon,
    },
    FetchPlanner: {
      id: 'FetchPlanner',
      title: 'Carregar Último Cronograma',
      icon: DownloadIcon,
    },
    UserInfo: {
      id: 'UserInfo',
      title: 'Usuário',
      render: () => <UserInfo />,
      icon: UserIcon,
    },
    Feedback: {
      id: 'Feedback',
      title: 'Feedback',
      render: () => <Feedback />,
      icon: FeedbackIcon,
    },
    LogOut: {
      id: 'LogOut',
      title: 'Sair',
      icon: LogOutIcon,
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

    const userPages = Object.fromEntries(
      Object.entries(pages)
        .filter(([key]) => !guestOnly.includes(key) || alwaysVisible.includes(key)),
    );
    return userPages;
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
