import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LoginModal = ({ isOpen, onClose }) => {
  const [userType, setUserType] = useState('voter');
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login successful!');
        onClose();
        navigate(userType === 'voter' ? '/voter-dashboard' : '/committee-dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button 
            className="close-button" 
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            &times;
          </motion.button>
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Login
          </motion.h2>
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label>Username or Email:</label>
              <input
                type="text"
                value={formData.usernameOrEmail}
                onChange={(e) => setFormData({...formData, usernameOrEmail: e.target.value})}
                required
              />
            </motion.div>
            <motion.div 
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label>Password:</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </motion.div>
            
            <motion.div 
              className="user-type-selector"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label>
                <input
                  type="radio"
                  value="voter"
                  checked={userType === 'voter'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Voter
              </label>
              <label>
                <input
                  type="radio"
                  value="committee"
                  checked={userType === 'committee'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Committee Member
              </label>
            </motion.div>

            <motion.button 
              type="submit" 
              className="submit-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Login
            </motion.button>
          </motion.form>
          <p>Don't have an account? <a href="#" onClick={() => {
            onClose();
            // You might want to pass a prop to App.jsx to open SignupModal
            // For now, this is a placeholder or you can handle it via context/redux
          }}>Sign Up</a></p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal; 