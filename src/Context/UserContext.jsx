import React, {
  createContext,
  useState,
  useMemo,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

export const userDefault = {
  name: '',
  email: '',
  church: '',
};

export const UserContext = createContext();

export function UserProvider({ children, setCurrentPage }) {
  const [user, setUser] = useState(null);
  const [userNotLoggedCount, setUserNotLoggedCount] = useState(0);

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const logIn = (token) => {
    const decodedToken = jwtDecode(token);
    const { data } = decodedToken;

    const userData = { ...data, token };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setCurrentPage('Home');
    setUserNotLoggedCount(0);
  };

  const variables = {
    user,
    logOut,
    logIn,
    userNotLoggedCount,
    setUserNotLoggedCount,
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
};
