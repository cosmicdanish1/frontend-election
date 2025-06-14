import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="liquidGlass-wrapper">
        <div className="liquidGlass-effect"></div>
        <div className="liquidGlass-tint"></div>
        <div className="liquidGlass-shine"></div>
        <div className="liquidGlass-text">
          <div className="footer-content">
            <p>&copy; 2024 Election Management System. All rights reserved.</p>
            <div className="footer-links">
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/privacy">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 