import React, { createContext, useState, useMemo } from 'react';

import PropTypes from 'prop-types';

const userDefault = {
  name: '',
  email: '',
  church: '',
};

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(userDefault);

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(userDefault);
  };

  const variables = {
    user,
    setUser,
    logOut,
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
