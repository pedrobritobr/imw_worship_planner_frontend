/* eslint-disable */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './Register.css';

const churchAllowed = [
  {
    name: 'Selecione a igreja',
    value: '',
  },
  {
    name: 'IMW São Cristovão',
    value: 'imwsccf',
  },
  {
    name: 'IMW Central CF',
    value: 'imwcentralcf',
  }
];

const userData = {
  email: '',
  password: '',
  church: '',
}

function Register({
  className,
}) {
  const [user, setUser] = useState(null);
  const [selectedChurch, setSelectedChurch] = useState(churchAllowed[0]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleRegister = (event) => {
    event.preventDefault();
    const { email, password } = event.target;
    userData.email = email.value;
    userData.password = password.value;
    userData.church = selectedChurch.value;
    console.log(userData);
    setUser(userData);
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
        <input type="password" id="register-password" name="password" required />
      </label>
      <label htmlFor="register-check-password">
        <span>Confirmar Senha:</span>
        <input type="check-password" id="register-check-password" name="check-password" required />
      </label>
      <label htmlFor="register-church">
        <span>Igreja:</span>
        <div
          className={`custom-select ${isDropdownOpen ? 'open' : ''}`}
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          <div className="select-trigger">{selectedChurch.name}</div>
          {isDropdownOpen && (
            <ul className="options">
              {churchAllowed.map((church) => (
                <li
                  key={church.value}
                  className="option"
                  onClick={() => handleSelectChurch(church)}
                >
                  {church.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </label>
    </form>
  );
}

Register.propTypes = {
  className: PropTypes.string,
};

export default Register;
