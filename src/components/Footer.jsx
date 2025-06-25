import React from 'react';
import './Footer.css'; // We'll create this next

const Footer = () => {
  return (
    <footer className="footer">
   

      <div className="footer-links">
        <div className="footer-column">
          <h3>NeuroPlay</h3>
          <p>Train your brain daily with our science-backed memory games</p>
        </div>
        <div className="footer-column">
          <h4>Games</h4>
          <a href="/wordle">Neuro Wordle</a>
          <a href="/memory-matrix">Memory Matrix</a>
          <a href="/sequence-master">Sequence Master</a>
        </div>
        <div className="footer-column">
          <h4>Resources</h4>
          <a href="/blog">Memory Tips</a>
          <a href="/research">The Science</a>
          <a href="/faq">FAQ</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} NeuroPlay. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;