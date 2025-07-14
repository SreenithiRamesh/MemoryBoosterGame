import React, { useState, useEffect } from 'react';
import './ChessInstruction.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCog } from 'react-icons/fa';

const ChessInstructions = () => {
  const [volume, setVolume] = useState(50);
  const [timeControl, setTimeControl] = useState('10+0');
  const [particles, setParticles] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Generate floating particles
    const generateParticles = () => {
      const newParticles = [];
      const particleCount = isMobile ? 10 : 20;
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          animationDelay: Math.random() * 6,
          animationDuration: 6 + Math.random() * 4
        });
      }
      setParticles(newParticles);
    };

    generateParticles();

    // Close settings when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.htpc-settings')) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [isMobile]);
const navigate = useNavigate();

const handlePlayClick = () => {
  navigate('/Chess-game');
};

  const handleBack = () => {
    // Add your back navigation logic here
    console.log('Back button clicked');
    // Example: window.history.back();
  };

  return (
    <div className="htpc-container">
      {/* Background Animation */}
      <div className="htpc-background"></div>
      
      {/* Floating Particles */}
      <div className="htpc-particles">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="htpc-particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="htpc-header">
        <div className="htpc-logo">CHESS MASTER</div>
        <div className="htpc-header-controls">
          <button 
            className="htpc-back-button"
            onClick={handleBack}
            aria-label="Back"
          >
            <FaArrowLeft className="htpc-back-icon" />
            {!isMobile && <span>Back</span>}
          </button>
          <div className="htpc-settings">
            <button 
              className="htpc-settings-button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              aria-label="Settings"
            >
              <FaCog className="htpc-settings-icon" />
              {!isMobile && <span>Settings</span>}
            </button>
            <div className={`htpc-settings-dropdown ${settingsOpen ? 'htpc-active' : ''}`}>
              <div className="htpc-settings-item">
                <span className="htpc-settings-label">Volume</span>
                <div className="htpc-volume-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="htpc-volume-slider"
                  />
                  <span className="htpc-volume-value">{volume}%</span>
                </div>
              </div>
              <div className="htpc-settings-item">
                <span className="htpc-settings-label">Time Control</span>
                <select
                  value={timeControl}
                  onChange={(e) => setTimeControl(e.target.value)}
                  className="htpc-settings-control"
                >
                  <option value="5+0">5+0</option>
                  <option value="10+0">10+0</option>
                  <option value="15+10">15+10</option>
                  <option value="30+0">30+0</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="htpc-main">
        {/* Left Side - Animation */}
        <div className="htpc-left">
          <div className="htpc-chess-animation">
            <div className="htpc-chess-board">
              {Array.from({ length: 64 }, (_, i) => {
                const highlightedSquares = [18, 27, 36, 45, 20, 29, 38, 47];
                return (
                  <div 
                    key={i} 
                    className={`htpc-chess-square ${highlightedSquares.includes(i) ? 'htpc-highlighted' : ''}`}
                  ></div>
                );
              })}
              
              <div className="htpc-chess-piece htpc-knight htpc-piece-white">♘</div>
              <div className="htpc-chess-piece htpc-queen htpc-piece-black">♛</div>
              <div className="htpc-chess-piece htpc-rook htpc-piece-white">♖</div>
              <div className="htpc-chess-piece htpc-bishop htpc-piece-black">♗</div>
              <div className="htpc-chess-piece htpc-pawn htpc-piece-white">♙</div>
              <div className="htpc-chess-piece htpc-king htpc-piece-black">♚</div>
            </div>
          </div>
          <button 
            className="htpc-start-button"
            onClick={handlePlayClick}
          >
            Start Playing
          </button>
        </div>

        {/* Right Side - Instructions */}
        <div className="htpc-right">
          <div className="htpc-instructions">
            <h1 className="htpc-title">Chess Quick Guide</h1>

            <div className="htpc-section">
              <h2 className="htpc-section-title">How Pieces Move</h2>
              <div className="htpc-section-content">
                <div className="htpc-rule">
                  <span className="htpc-highlight">Pawn:</span> Forward 1 square (2 on first move), captures diagonally
                </div>
                <div className="htpc-rule">
                  <span className="htpc-highlight">Rook:</span> Horizontally or vertically, any distance
                </div>
                <div className="htpc-rule">
                  <span className="htpc-highlight">Bishop:</span> Diagonally, any distance
                </div>
                <div className="htpc-rule">
                  <span className="htpc-highlight">Knight:</span> L-shape (2+1 squares), can jump over pieces
                </div>
                <div className="htpc-rule">
                  <span className="htpc-highlight">Queen:</span> Any direction, any distance
                </div>
                <div className="htpc-rule">
                  <span className="htpc-highlight">King:</span> Any direction, 1 square only
                </div>
              </div>
            </div>

            <div className="htpc-section">
              <h2 className="htpc-section-title">Game End</h2>
              <div className="htpc-section-content">
                <div className="htpc-rule">
                  <span className="htpc-highlight">Checkmate:</span> King is attacked and cannot escape - You win!
                </div>
                <div className="htpc-rule">
                  <span className="htpc-highlight">Stalemate:</span> No legal moves but king not in check - Draw
                </div>
                <div className="htpc-rule">
                  <span className="htpc-highlight">Draw:</span> Insufficient material, repetition, or 50-move rule
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessInstructions;