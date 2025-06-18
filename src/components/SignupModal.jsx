import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SignupModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [userType, setUserType] = useState('voter');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'prefer_not_to_say',
    dateOfBirth: ''
  });
  const [osClass, setOsClass] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('mac')) {
      setOsClass('os-mac');
    } else if (platform.includes('win')) {
      setOsClass('os-windows');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      console.log('Sending registration data:', {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        role: userType,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth
      });

      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
          role: userType,
          gender: formData.gender,
          date_of_birth: formData.dateOfBirth
        }),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok) {
        alert('Registration successful!');
        onAuthSuccess(data.user);
        onClose();
        navigate(userType === 'voter' ? '/voter-dashboard' : '/committee-dashboard');
      } else {
        alert(data.error || data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
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
            className={`close-button ${osClass}`}
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
            Sign Up
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
              <label>Username:</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </motion.div>
            <motion.div 
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </motion.div>
            <motion.div 
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <label>Gender:</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                required
              >
                <option value="prefer_not_to_say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </motion.div>
            <motion.div 
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label>Date of Birth:</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                required
              />
            </motion.div>
            <motion.div 
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
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
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label>Confirm Password:</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </motion.div>
            
            <motion.div 
              className="user-type-selector"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
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
              transition={{ delay: 0.8 }}
            >
              Sign Up
            </motion.button>
          </motion.form>
          <p>Already have an account? <a href="#">Sign In</a></p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignupModal; 