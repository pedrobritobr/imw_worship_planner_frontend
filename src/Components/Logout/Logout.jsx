import React, { useContext, useEffect } from 'react';

import { UserContext } from '@/Context/UserContext';
import { PageContext } from '@/Context/PageContext';

function Logout() {
  const { logOut } = useContext(UserContext);
  const { setCurrentPage, pages } = useContext(PageContext);

  useEffect(() => {
    logOut();
    setCurrentPage(pages.Home);
  }, [logOut]);

  return (<div />);
}

export default Logout;
