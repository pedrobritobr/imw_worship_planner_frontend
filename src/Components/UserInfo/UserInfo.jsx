import React, { useContext } from 'react';

import { UserContext } from '@/Context/UserContext';

import './UserInfo.css';

function UserInfo() {
  const { user } = useContext(UserContext);

  return (
    <div className="UserInfo user-info">
      <p className="user_name">{user ? user.name : ''}</p>
      <p className="user_email">{user ? user.email : ''}</p>
      <p className="user_church">{user ? user.church : ''}</p>
    </div>
  );
}

export default UserInfo;
