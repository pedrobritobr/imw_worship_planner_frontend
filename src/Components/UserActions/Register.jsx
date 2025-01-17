/* eslint-disable */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './Register.css';

const churchAllowed = [
  'Selecione a igreja',
  'Wesleyana São Cristovão',
  'Wesleyana Central CF',
];

function Register({
  className,
}) {
  const [user, setUser] = useState(null);
  const [selectedChurch, setSelectedChurch] = useState(churchAllowed[0]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const showPassword = (elementId) => {
    const passwordInput = document.getElementById(elementId);
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  const showErrorMessage = (message) => {
    const errorMessage = document.querySelector('.register-error-message');
    errorMessage.textContent = message;
  }

  const handleRegister = (event) => {
    event.preventDefault();
    showErrorMessage('');

    const password = event.target["register-password"].value;
    const checkPassword = event.target["register-check-password"].value;

    if (password !== checkPassword) {
      showErrorMessage('As senhas não coincidem');
      return;
    }

    const userData = {
      email: '',
      password: '',
      church: '',
    }
    userData.email = event.target["register-email"].value;
    userData.church = selectedChurch;
    console.log(userData);
    setUser(userData);
    console.log(user);
  };

  const handleSelectChurch = (church) => {
    setSelectedChurch(church);
    setDropdownOpen(false);
  };

  return (
    <form className={`${className} register-form`} onSubmit={handleRegister}>
      <header>
        <h4>Cadastro</h4>
        <button type="submit">Cadastrar</button>
      </header>
      <label htmlFor="register-email" id="input-register-email">
        <span>Email:</span>
        <input type="email" id="register-email" required />
      </label>
      <label htmlFor="register-password">
        <span>Senha:</span>
        <input type="password" id="register-password" name="password" minLength={8} required />
      <button type="button" onClick={() => showPassword("register-password")}>
        Mostrar
      </button>
      </label>
      <label htmlFor="register-check-password">
        <span className="register-check-password">
          <span className="small-text">Confirmar</span>
          Senha:
        </span>
        <input type="password" id="register-check-password" name="check-password" minLength={8} required />
        <button type="button" onClick={() => showPassword("register-check-password")}>
          Mostrar
        </button>
      </label>
      <label htmlFor="register-church">
        <span>Igreja:</span>
        <div
          className={`custom-select ${isDropdownOpen ? 'open' : ''}`}
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          <div className="select-trigger">{selectedChurch}</div>
          {isDropdownOpen && (
            <ul className="options">
              {churchAllowed.map((church) => (
                <li
                  key={church}
                  className="option"
                  onClick={() => handleSelectChurch(church)}
                >
                  {church}
                </li>
              ))}
            </ul>
          )}
        </div>
      </label>
      <p className="register-error-message" />
    </form>
  );
}

Register.propTypes = {
  className: PropTypes.string,
};

export default Register;
