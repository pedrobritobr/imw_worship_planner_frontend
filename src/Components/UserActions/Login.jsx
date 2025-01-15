/* eslint-disable */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './Login.css';

const userData = {
  email: '',
  password: '',
  church: '',
}

function Login({
  className,
}) {
  const [user, setUser] = useState(null);

  const handleLogin = (event) => {
    event.preventDefault();
    const { email, password } = event.target;
    userData.email = email.value;
    userData.password = password.value;
    console.log(userData);
    setUser(userData);
  }

  return (
    <form className={`${className} login-form`} onSubmit={handleLogin}>
      <header>
        <h4>Login</h4>
        <button type="submit">Entrar</button>
      </header>
      <label htmlFor="login-email">
        <span>Email:</span>
        <input type="email" id="login-email" required />
      </label>
      <label htmlFor="login-password">
        <span>Senha:</span>
        <input type="password" id="login-password" name="password" required />
      </label>
    </form>
  );
}

export default Login;