
import './2048Instructions.css'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Play, Settings, Volume2, VolumeX, X } from 'lucide-react';

const GameInstructions = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
const navigate = useNavigate();

const handlePlayClick = () => {
  navigate('/flow2048');
};
  return (
    <div className="htpg-container">
      {/* Animated Background */}
      <div className="htpg-background-animation">
        <div className="htpg-floating-orb htpg-orb-1"></div>
        <div className="htpg-floating-orb htpg-orb-2"></div>
        <div className="htpg-floating-orb htpg-orb-3"></div>
        <div className="htpg-floating-orb htpg-orb-4"></div>
        <div className="htpg-floating-orb htpg-orb-5"></div>
      </div>
      
      {/* Overlay */}
      <div className="htpg-overlay"></div>
      
      {/* Settings Button - Top Right */}
      <button 
        className="htpg-settings-btn"
        onClick={() => setShowSettings(true)}
      >
        <Settings className="htpg-icon" />
      </button>
      
      {/* Main Content */}
      <div className="htpg-content">
        <div className="htpg-header">
          <h1 className="htpg-title">2048</h1>
          <p className="htpg-subtitle">Master the Numbers</p>
        </div>

        <div className="htpg-game-layout">
          {/* Left Side - Demo Board */}
          <div className="htpg-left-section">
            <div className="htpg-demo-board">
              <div className="htpg-demo-title">Example Board</div>
              <div className="htpg-grid">
                <div className="htpg-tile htpg-tile-2">2</div>
                <div className="htpg-tile htpg-tile-4">4</div>
                <div className="htpg-tile htpg-tile-8">8</div>
                <div className="htpg-tile htpg-tile-16">16</div>
                <div className="htpg-tile htpg-tile-32">32</div>
                <div className="htpg-tile htpg-tile-64">64</div>
                <div className="htpg-tile htpg-tile-128">128</div>
                <div className="htpg-tile htpg-tile-256">256</div>
                <div className="htpg-tile htpg-tile-512">512</div>
                <div className="htpg-tile htpg-tile-1024">1024</div>
                <div className="htpg-tile htpg-tile-2048">2048</div>
                <div className="htpg-tile htpg-tile-empty"></div>
                <div className="htpg-tile htpg-tile-empty"></div>
                <div className="htpg-tile htpg-tile-empty"></div>
                <div className="htpg-tile htpg-tile-empty"></div>
                <div className="htpg-tile htpg-tile-empty"></div>
              </div>
            </div>
            
            {/* Start Button below demo board */}
            <button className="htpg-btn htpg-btn-primary htpg-start-btn"  onClick={handlePlayClick}>
              <Play className="htpg-icon" />
              Start Game
            </button>
          </div>

          {/* Right Side - Instructions */}
          <div className="htpg-right-section">
            <div className="htpg-instructions-card">
              <div className="htpg-card-header">
                <h2 className="htpg-card-title">How to Play</h2>
              </div>
              
              <div className="htpg-rules">
                <div className="htpg-rule">
                  <div className="htpg-rule-number">1</div>
                  <div className="htpg-rule-text">
                    <h3>Swipe or Use Arrow Keys</h3>
                    <p>Move tiles up, down, left, or right</p>
                  </div>
                </div>
                
                <div className="htpg-rule">
                  <div className="htpg-rule-number">2</div>
                  <div className="htpg-rule-text">
                    <h3>Merge Same Numbers</h3>
                    <p>When two tiles with the same number touch, they merge into one</p>
                  </div>
                </div>
                
                <div className="htpg-rule">
                  <div className="htpg-rule-number">3</div>
                  <div className="htpg-rule-text">
                    <h3>Reach 2048</h3>
                    <p>Create a tile with the number 2048 to win</p>
                  </div>
                </div>
                
                <div className="htpg-rule">
                  <div className="htpg-rule-number">4</div>
                  <div className="htpg-rule-text">
                    <h3>Don't Fill the Board</h3>
                    <p>Game ends when no more moves are possible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="htpg-modal-overlay">
          <div className="htpg-modal">
            <div className="htpg-modal-header">
              <h3 className="htpg-modal-title">Settings</h3>
              <button 
                className="htpg-close-btn"
                onClick={() => setShowSettings(false)}
              >
                <X className="htpg-icon" />
              </button>
            </div>
            
            <div className="htpg-modal-content">
              <div className="htpg-setting-item">
                <div className="htpg-setting-label">
                  <div className="htpg-setting-icon">
                    {soundEnabled ? <Volume2 /> : <VolumeX />}
                  </div>
                  <span>Sound Effects</span>
                </div>
                <button 
                  className={`htpg-toggle ${soundEnabled ? 'htpg-toggle-on' : 'htpg-toggle-off'}`}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  <div className="htpg-toggle-slider"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameInstructions;