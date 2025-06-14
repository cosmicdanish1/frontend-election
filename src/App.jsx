import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import './App.css';

// Placeholder components for dashboards
const VoterDashboard = () => <div>Voter Dashboard</div>;
const CommitteeDashboard = () => <div>Committee Dashboard</div>;

const App = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  return (
    <Router>
      <div className="app">
        <Header 
          onLoginClick={() => setIsLoginModalOpen(true)}
          onSignupClick={() => setIsSignupModalOpen(true)}
        />
        
        <main className="main-content">
          <div className="hero-section">
            <h1>Secure and Transparent Electronic Voting</h1>
            <p>Experience the future of voting with our secure, transparent, and user-friendly platform.</p>
            <div className="cta-buttons">
              <button onClick={() => setIsLoginModalOpen(true)} className="cta-button">Get Started</button>
            </div>
          </div>
        </main>

        <Footer />

        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />

        <SignupModal 
          isOpen={isSignupModalOpen}
          onClose={() => setIsSignupModalOpen(false)}
        />

        <Routes>
          <Route path="/voter-dashboard" element={<VoterDashboard />} />
          <Route path="/committee-dashboard" element={<CommitteeDashboard />} />
          <Route path="/" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
