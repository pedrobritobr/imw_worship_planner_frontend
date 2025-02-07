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
  const [isLogin, setIsLogin] = useState(false);

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserLocal({ ...userLocal, [name]: value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLogin(true);
    showErrorMessage('#LoginErrorMessage', '');

    const response = await requestLogin(userLocal);
    if (response.errorMsg) {
      showErrorMessage('#LoginErrorMessage', response.errorMsg);
    } else {
      const { message } = response.data;
      logIn(message);
    }
    setIsLogin(false);
  };

  return (
    <form className={`${className} Login`} onSubmit={handleLogin}>
      <h4 id="LoginTitle">Login</h4>
      <label id="LoginEmail" htmlFor="login-email">
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
      <label id="LoginPassword" htmlFor="login-password">
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
      <button id="LoginSubmit" type="submit">
        { isLogin ? 
          <span className="loader"></span>
          :
          <span>Entrar</span>
        }
      </button>
      <p id="LoginErrorMessage" />
    </form>
  );
}

Login.propTypes = {
  className: PropTypes.string,
}.isRequired;

export default Login;
