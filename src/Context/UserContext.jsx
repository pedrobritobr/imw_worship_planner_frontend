import React, {
  createContext,
  useState,
  useMemo,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

export const userDefault = {
  name: 'Pedro Brito',
  email: 'me@pedrobrito.dev',
  church: 'Wesleyana São Cristóvão',
};

export const UserContext = createContext();

export function UserProvider({ children, setCurrentPage, pages }) {
  const [user, setUser] = useState(null);
  const [userNotLoggedCount, setUserNotLoggedCount] = useState(0);

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage(pages.Home);
  };

  const logIn = (token) => {
    const decodedToken = jwtDecode(token);
    const { data } = decodedToken;

    const userData = { ...data, token };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setCurrentPage(pages.Home);
    setUserNotLoggedCount(0);
  };

  const variables = {
    user,
    logOut,
    logIn,
    userNotLoggedCount,
    setUserNotLoggedCount,
    setCurrentPage,
    pages,
  };

  const value = useMemo(() => (variables), Object.values(variables));

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  pages: PropTypes.objectOf(PropTypes.shape({
    title: PropTypes.string,
    render: PropTypes.func,
    icon: PropTypes.string,
  })).isRequired,
};
