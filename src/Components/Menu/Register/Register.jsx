import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { UserContext } from '../../../Context/UserContext';

import { showErrorMessage } from '../../../helpers';
import { requestRegisterUser } from '../../../service';

import ShowPassSVG from '../../../assets/eye-show-svgrepo-com.svg';
import HidePassSVG from '../../../assets/eye-hide-svgrepo-com.svg';

import './Register.css';

const churchAllowed = [
  'Selecione a igreja',
  'Wesleyana São Cristovão',
  'Wesleyana Três Rios',
];

const userDefault = {
  name: '',
  email: '',
  password: '',
  checkPassword: '',
  church: 'Selecione a igreja',
};

function Register({
  className,
}) {
  const { logIn } = useContext(UserContext);
  const [userLocal, setUserLocal] = useState(userDefault);
  const [showPass, setShowPass] = useState(false);
  const [showCheckPass, setShowCheckPass] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserLocal({ ...userLocal, [name]: value });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsRegistering(true);

    const errorTagId = '#RegisterErrorMessage';
    showErrorMessage(errorTagId, '');

    const { checkPassword, ...userWithoutCheckPassword } = userLocal;

    if (userLocal.password !== checkPassword) return showErrorMessage(errorTagId, 'As senhas não coincidem');
    if (userLocal.church === 'Selecione a igreja') return showErrorMessage(errorTagId, 'Selecione uma igreja');

    const response = await requestRegisterUser(userWithoutCheckPassword);
    if (response.errorMsg) {
      showErrorMessage(errorTagId, response.errorMsg);
    } else {
      const { message } = response.data;
      logIn(message);
    }
    return setIsRegistering(false);
  };

  return (
    <form className={`${className} Register`} onSubmit={handleRegister}>
      <h4>Cadastro</h4>
      <label id="RegisterName" htmlFor="register-name">
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
      <label id="RegisterEmail" htmlFor="register-email">
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
      <label id="RegisterPassword" htmlFor="register-password">
        <span>Senha:</span>
        <input
          type={showPass ? 'text' : 'password'}
          id="register-password"
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
      <label id="RegisterCheckPassword" htmlFor="register-check-password">
        <span className="register-check-password-span">
          <span className="small-text">Confirmar</span>
          Senha:
        </span>
        <input
          type={showCheckPass ? 'text' : 'password'}
          id="register-check-password"
          name="checkPassword"
          minLength={8}
          onChange={handleUserChange}
          value={userLocal.checkPassword}
          required
        />
        <button type="button" onClick={() => setShowCheckPass(!showCheckPass)}>
          <img
            src={showCheckPass ? HidePassSVG : ShowPassSVG}
            className={`password-icon-button ${showCheckPass ? 'hide' : 'show'}`}
            alt="Ocultar senha"
          />
        </button>
      </label>
      <label id="RegisterChurch" htmlFor="register-church">
        <span>Igreja:</span>
        <select
          id="RegisterChurchSelect"
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
      <button id="RegisterSubmit" type="submit">
        {
          isRegistering
            ? <span className="loader" />
            : <span>Cadastrar</span>
        }
      </button>
      <p id="RegisterErrorMessage" />
    </form>
  );
}

Register.propTypes = {
  className: PropTypes.string,
}.isRequired;

export default Register;
