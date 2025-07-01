import { useContext, useCallback } from 'react';
import { UserContext } from '@/Context/UserContext';

function useLogout() {
  const { logOut } = useContext(UserContext);

  const logout = useCallback(() => {
    logOut();
  }, [logOut]);

  return [logout];
}

export default useLogout;
