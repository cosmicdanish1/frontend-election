import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onLoginClick, onSignupClick }) => {
  return (
    <header className="header">
      <div className="logo-text">
        E-Voting System
      </div>
      <nav className="nav-buttons">
        <button onClick={onLoginClick} className="plain-button">Login</button>
        <button onClick={onSignupClick} className="plain-button signup-button">Sign Up</button>
      </nav>
    </header>
  );
};

export default Header; 