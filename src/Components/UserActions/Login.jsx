/* eslint-disable */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { requestLogin } from '../../service';
import { showErrorMessage, showPassword } from '../../helpers';

import './Login.css';

const userDefault = {
  email: '',
  password: '',
}

function Login({
  className,
}) {
  const [user, setUser] = useState(userDefault);

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  }

  const handleLogin = (event) => {
    event.preventDefault();
    showErrorMessage('.login-error-message', '');

    const message = requestLogin(user);

    if (message) {
      showErrorMessage('.login-error-message', message);
    } else {
      setUser(userDefault);
      console.log('sucesso');
    }
  }

  return (
    <form className={`${className} login-form`} onSubmit={handleLogin}>
      <header>
        <h4>Login</h4>
        <button type="submit">Entrar</button>
      </header>
      <label htmlFor="login-email">
        <span>Email:</span>
        <input
          type="email"
          id="login-email"
          name="email"
          onChange={handleUserChange}
          value={user.email}
          required />
      </label>
      <label htmlFor="login-password">
        <span>Senha:</span>
        <input
          type="password"
          id="login-password"
          name="password"
          minLength={8}
          onChange={handleUserChange}
          value={user.password}
          required
        />
        <button type="button" onClick={() => showPassword("login-password")}>
          Mostrar
        </button>
      </label>
      <p className="login-error-message" />
    </form>
  );
}

export default Login;