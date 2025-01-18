import React, { createContext, useState, useMemo } from 'react';

import PropTypes from 'prop-types';

const userDefault = {
  email: '',
  church: '',
};

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(userDefault);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
