/* eslint-disable */

import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { UserContext } from '../../../Context/UserContext';

import { showErrorMessage, showPassword } from '../../../helpers';
import { requestLogin, requestRegisterUser } from '../../../service';
import './Register.css';

const churchAllowed = [
  'Selecione a igreja',
  'Wesleyana São Cristovão',
  'Wesleyana Central CF',
];

const userDefault = {
  name: '',
  email: '',
  password: '',
  checkPassword: '',
  church: 'Selecione a igreja',
}

function Register({
  className,
}) {
  const { setUser } = useContext(UserContext);
  const [userLocal, setUserLocal] = useState(userDefault);

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserLocal({ ...userLocal, [name]: value });
  }

  const handleRegister = (event) => {
    event.preventDefault();
    const errorClass = '.register-error-message';
    showErrorMessage(errorClass, '');

    const { checkPassword, ...userWithoutCheckPassword } = userLocal;

    if (userLocal.password !== checkPassword) return showErrorMessage(errorClass, 'As senhas não coincidem');
    if (userLocal.church === 'Selecione a igreja') return showErrorMessage(errorClass, 'Selecione uma igreja');
    
    const message = requestRegisterUser(userWithoutCheckPassword);
    if (message) {
      showErrorMessage(errorClass, message);
    } else {
      setUserLocal(userDefault);
      const response = requestLogin(userWithoutCheckPassword);
      setUser(response);
    }
  };

  return (
    <form className={`${className} register-form`} onSubmit={handleRegister}>
      <header>
        <h4>Cadastro</h4>
        <button type="submit">Cadastrar</button>
      </header>
      <label htmlFor="register-name" id="input-register-name">
        <span>Nome:</span>
        <input
          type="text"
          id="register-name"
          name="name"
          onChange={handleUserChange}
          value={userLocal.name}
          required
        />
      </label>
      <label htmlFor="register-email" id="input-register-email">
        <span>Email:</span>
        <input
          type="email"
          id="register-email"
          name="email"
          onChange={handleUserChange}
          value={userLocal.email}
          required 
        />
      </label>
      <label htmlFor="register-password">
        <span>Senha:</span>
        <input
          type="password"
          id="register-password"
          name="password"
          minLength={8}
          onChange={handleUserChange}
          value={userLocal.password}
          required 
        />
      <button type="button" onClick={() => showPassword("register-password")}>
        Mostrar
      </button>
      </label>
      <label htmlFor="register-check-password">
        <span className="register-check-password">
          <span className="small-text">Confirmar</span>
          Senha:
        </span>
        <input
          type="password"
          id="register-check-password"
          name="checkPassword"
          minLength={8}
          onChange={handleUserChange}
          value={userLocal.checkPassword}
          required 
        />
        <button type="button" onClick={() => showPassword("register-check-password")}>
          Mostrar
        </button>
      </label>
      <label htmlFor="register-church">
        <span>Igreja:</span>
        <select
          id="register-church-select"
          name="church"
          onChange={handleUserChange}
          value={userLocal.church}
        >
          {churchAllowed.map((church) => (
            <option className="register-church-option" key={church} value={church}>
              {church}
            </option>
          ))}
        </select>
      </label>
      <p className="register-error-message" />
    </form>
  );
}

Register.propTypes = {
  className: PropTypes.string,
};

export default Register;
