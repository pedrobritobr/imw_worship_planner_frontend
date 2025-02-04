/* eslint-disable */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { UserContext } from '../../../Context/UserContext';

import { requestLogin } from '../../../service';
import { showErrorMessage } from '../../../helpers';

import ShowPassSVG from '../../../assets/eye-show-svgrepo-com.svg';
import HidePassSVG from '../../../assets/eye-hide-svgrepo-com.svg';

import './Login.css';

const userDefault = {
  email: '',
  password: '',
};

function Login({
  className,
}) {
  const { logIn } = useContext(UserContext);
  const [userLocal, setUserLocal] = useState(userDefault);
  const [showPass, setShowPass] = useState(false);

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserLocal({ ...userLocal, [name]: value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    showErrorMessage('.login-error-message', '');

    const response = await requestLogin(userLocal);
    if (response.errorMsg) {
      showErrorMessage('.login-error-message', response.errorMsg);
    } else {
      const { message } = response.data;
      logIn(message);
    }
  };

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
          value={userLocal.email}
          required
        />
      </label>
      <label htmlFor="login-password">
        <span>Senha:</span>
        <input
          type={ showPass ? "text" : "password"}
          id="login-password"
          name="password"
          minLength={8}
          onChange={handleUserChange}
          value={userLocal.password}
          required
        />
        <button type="button" onClick={() => setShowPass(!showPass)}>
          <img
            src={showPass ? HidePassSVG : ShowPassSVG}
            className={`password-icon-button ${showPass ? 'hide' : 'show'}`}
            alt="Ocultar senha"
          />
        </button>
      </label>
      <p className="login-error-message" />
    </form>
  );
}

Login.propTypes = {
  className: PropTypes.string,
}.isRequired;

export default Login;
