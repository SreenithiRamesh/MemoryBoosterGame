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
         <a href="/wordle-instructions">Wordle</a>
          <a href="/chess-instructions">Chess</a>
          <a href="/game2048-instructions">2048</a>
          <a href="/simon-instruction">Simon Says</a>
        </div>
      <div className="footer-column">
  <h4>How to Play</h4>
  <a href="/wordle-instructions">Wordle Rules</a>
  <a href="/chess-instructions">Chess Rules</a>
  <a href="/game2048-instructions">2048 Rules</a>
  <a href="/simon-instruction">Simon Rules</a>
</div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} NeuroPlay. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;