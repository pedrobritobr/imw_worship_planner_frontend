import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { UserContext } from '../../../Context/UserContext';

import { requestLogin } from '../../../service';
import { showErrorMessage, showPassword } from '../../../helpers';

import './Login.css';

const userDefault = {
  email: '',
  password: '',
};

function Login({
  className,
}) {
  const { setUser } = useContext(UserContext);
  const [userLocal, setUserLocal] = useState(userDefault);

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserLocal({ ...userLocal, [name]: value });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    showErrorMessage('.login-error-message', '');

    const response = requestLogin(userLocal);

    if (response.errorMsg) {
      showErrorMessage('.login-error-message', response.errorMsg);
    } else {
      setUserLocal(userDefault);
      setUser(response.user);
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
          type="password"
          id="login-password"
          name="password"
          minLength={8}
          onChange={handleUserChange}
          value={userLocal.password}
          required
        />
        <button type="button" onClick={() => showPassword('login-password')}>
          Mostrar
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
