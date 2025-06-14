import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = ({ onLoginClick, onSignupClick }) => {
  return (
    <motion.header 
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div 
        className="logo-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        E-Voting System
      </motion.div>
      <nav className="nav-buttons">
        <motion.button 
          onClick={onLoginClick} 
          className="plain-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Login
        </motion.button>
        <motion.button 
          onClick={onSignupClick} 
          className="plain-button signup-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Sign Up
        </motion.button>
      </nav>
    </motion.header>
  );
};

export default Header; 