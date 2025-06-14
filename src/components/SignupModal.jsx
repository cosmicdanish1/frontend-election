import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupModal = ({ isOpen, onClose }) => {
  const [userType, setUserType] = useState('voter');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
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
        alert('Registration successful!');
        onClose();
        navigate(userType === 'voter' ? '/voter-dashboard' : '/committee-dashboard');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Sign Up</h2>
        <div className="user-type-selector">
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
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="submit-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal; 