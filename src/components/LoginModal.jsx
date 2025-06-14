import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
  const [userType, setUserType] = useState('voter');
  const [formData, setFormData] = useState({
    email: '',
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
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', userType);
        navigate(userType === 'voter' ? '/voter-dashboard' : '/committee-dashboard');
        onClose();
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
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Login</h2>
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
          <button type="submit" className="submit-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal; 