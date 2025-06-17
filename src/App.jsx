import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {  motion,AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import FeatureCards from './components/FeatureCards';
import VoterDashboard from './components/VoterDashboard';
import CommitteeDashboard from './components/CommitteeDashboard';
import './App.css';

// (Placeholder for voter already exists elsewhere)

const App = () => {
  // Initialise from localStorage so we avoid a flash-redirect before useEffect runs
  const storedUserJson = localStorage.getItem('currentUser');
  const initialUser = storedUserJson ? JSON.parse(storedUserJson) : null;

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialUser);
  const [currentUser, setCurrentUser] = useState(initialUser);

  // Persist / verify login state on app load
  useEffect(() => {
    if (initialUser) return; // already have user from localStorage -> skip server check

    // Fallback: ask backend if an active session exists (cookie-based)
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/me`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          setIsLoggedIn(true);
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
      })
      .catch(() => {
        // Not logged in – ensure clean state
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
      });
  }, []);

  const handleAuthSuccess = (userData) => {
    // Ensure userData.name exists, otherwise fallback to email or empty string
    const userName = userData?.name || userData?.email || '';
    
    setIsLoggedIn(true);
    setCurrentUser({ ...userData, name: userName }); // Ensure name is always set
    localStorage.setItem('currentUser', JSON.stringify({ ...userData, name: userName }));
    console.log('Current user state after handleAuthSuccess:', { isLoggedIn: true, currentUser: { ...userData, name: userName } }); // Final debug log
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Logged out successfully!');
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        // Optionally navigate to home or login page after logout
        // navigate('/'); 
      } else {
        const data = await response.json();
        alert(data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout');
    }
  };

  return (
    <Router>
      <motion.div 
        className="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header 
          onLoginClick={() => setIsLoginModalOpen(true)}
          onSignupClick={() => setIsSignupModalOpen(true)}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={(
              <motion.div 
                className="hero-section"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut"
                }}
              >
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Secure and Transparent Electronic Voting
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Experience the future of voting with our secure, transparent, and user-friendly platform.
                </motion.p>
                <motion.div 
                  className="cta-buttons"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <motion.button 
                    onClick={() => setIsLoginModalOpen(true)} 
                    className="cta-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </motion.div>

                <FeatureCards />

              </motion.div>
            )} />
            <Route path="/voter-dashboard" element={isLoggedIn ? <VoterDashboard /> : <Navigate to="/" replace />} />
            <Route path="/committee-dashboard" element={<CommitteeDashboard />} />
          </Routes>
        </main>

        <motion.div 
          className="scroll-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="scroll-text">
            <span>🔒 Secure Voting System</span>
            <span>📊 Real-time Results</span>
            <span>👥 Multiple User Roles</span>
            <span>🔐 End-to-End Encryption</span>
            <span>📱 Mobile Responsive</span>
            <span>✅ Easy Verification</span>
            <span>🔒 Secure Voting System</span>
            <span>📊 Real-time Results</span>
            <span>👥 Multiple User Roles</span>
            <span>🔐 End-to-End Encryption</span>
            <span>📱 Mobile Responsive</span>
            <span>✅ Easy Verification</span>
          </div>
        </motion.div>

        <Footer />

        <AnimatePresence>
          {isLoginModalOpen && (
            <LoginModal 
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              onAuthSuccess={handleAuthSuccess}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSignupModalOpen && (
            <SignupModal 
              isOpen={isSignupModalOpen}
              onClose={() => setIsSignupModalOpen(false)}
              onAuthSuccess={handleAuthSuccess}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Router>
  );
};

export default App;
