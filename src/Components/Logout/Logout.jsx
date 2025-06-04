import React, { useContext, useEffect } from 'react';

import { UserContext } from '@/Context/UserContext';

function Logout() {
  const { logOut } = useContext(UserContext);

  useEffect(() => {
    logOut();
  }, [logOut]);

  return (<div />);
}

export default Logout;
