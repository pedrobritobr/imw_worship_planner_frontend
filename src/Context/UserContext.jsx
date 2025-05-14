import React, {
  createContext,
  useState,
  useMemo,
  useContext,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

import { PageContext } from '@/Context/PageContext';

export const userDefault = {
  name: '',
  email: '',
  church: '',
};

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const { setCurrentPage } = useContext(PageContext);

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
  };

  const variables = {
    user,
    logOut,
    logIn,
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
};
