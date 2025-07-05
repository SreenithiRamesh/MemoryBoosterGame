import React, { useState, useEffect } from 'react';
import { Settings, Play, Volume2, VolumeX, ArrowLeft } from 'lucide-react'; // ADD ArrowLeft
import { useNavigate } from 'react-router-dom';

import './WordleInstructions.css';

const WordleInstruction = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [floatingLetters, setFloatingLetters] = useState([]);

  // Generate floating letters for background animation
  useEffect(() => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const newFloatingLetters = [];
    
    for (let i = 0; i < 15; i++) {
      newFloatingLetters.push({
        id: i,
        letter: letters[Math.floor(Math.random() * letters.length)],
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4
      });
    }
    
    setFloatingLetters(newFloatingLetters);
  }, []);
const navigate = useNavigate();

 const handlePlayClick = () => {
  navigate('/wordle-levels');
};


  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const saveSettings = () => {
    // Note: localStorage is not available in Claude.ai artifacts
    // In a real application, you would save settings here
    console.log('Settings saved:', { soundEnabled });
    setShowSettings(false);
  };

  return (
    <div className="htpw-instruction-page">
      {/* Background Animation */}
      <div className="htpw-background-container">
        <div className="htpw-video-overlay"></div>
        <div className="htpw-animated-background">
          <div className="htpw-gradient-orb htpw-orb-1"></div>
          <div className="htpw-gradient-orb htpw-orb-2"></div>
          <div className="htpw-gradient-orb htpw-orb-3"></div>
        </div>
      </div>

      {/* Floating Letters Animation */}
      <div className="htpw-floating-letters">
        {floatingLetters.map(letter => (
          <div
            key={letter.id}
            className="htpw-floating-letter"
            style={{
              left: `${letter.left}%`,
              animationDelay: `${letter.delay}s`,
              animationDuration: `${letter.duration}s`
            }}
          >
            {letter.letter}
          </div>
        ))}
      </div>

      <div className="htpw-container">
       <header className="htpw-header">
  <div className="htpw-logo">
    <h1>Wordle</h1>
  </div>

  <div style={{ display: 'flex', gap: '10px' }}>
    <button 
      className="htpw-back-btn"
      onClick={() => navigate('/Games')}
      aria-label="Back"
    >
      <ArrowLeft size={20} />
    </button>
    <button 
      className="htpw-settings-btn"
      onClick={toggleSettings}
      aria-label="Settings"
    >
      <Settings size={24} />
    </button>
  </div>
</header>


        <main className="htpw-main-content">
          {/* Left Side - Animation and Play Button */}
          <div className="htpw-left-section">
            <div className="htpw-game-preview">
              <div className="htpw-wordle-grid">
                <div className="htpw-grid-row">
                  <div className="htpw-tile htpw-correct htpw-animate-flip">W</div>
                  <div className="htpw-tile htpw-wrong-position htpw-animate-flip">O</div>
                  <div className="htpw-tile htpw-incorrect htpw-animate-flip">R</div>
                  <div className="htpw-tile htpw-wrong-position htpw-animate-flip">L</div>
                  <div className="htpw-tile htpw-correct htpw-animate-flip">E</div>
                </div>
                <div className="htpw-grid-row">
                  <div className="htpw-tile htpw-empty htpw-pulse"></div>
                  <div className="htpw-tile htpw-empty htpw-pulse"></div>
                  <div className="htpw-tile htpw-empty htpw-pulse"></div>
                  <div className="htpw-tile htpw-empty htpw-pulse"></div>
                  <div className="htpw-tile htpw-empty htpw-pulse"></div>
                </div>
                <div className="htpw-grid-row">
                  <div className="htpw-tile htpw-empty"></div>
                  <div className="htpw-tile htpw-empty"></div>
                  <div className="htpw-tile htpw-empty"></div>
                  <div className="htpw-tile htpw-empty"></div>
                  <div className="htpw-tile htpw-empty"></div>
                </div>
              </div>
            </div>

            <div className="htpw-play-section">
              <button 
                className="htpw-play-btn"
                onClick={handlePlayClick}
              >
                <Play size={20} />
                Start Playing
              </button>
            </div>
          </div>

          {/* Right Side - Instructions */}
          <div className="htpw-right-section">
            <div className="htpw-instructions">
             
              
              <div className="htpw-quick-guide">
                 <h2>How to Play</h2>
                <p>Guess the 5-letter word in 6 tries!</p>
                
                <div className="htpw-color-guide">
                  <div className="htpw-color-example">
                    <div className="htpw-example-tile htpw-correct">W</div>
                    <span>Correct letter, correct position</span>
                  </div>
                  <div className="htpw-color-example">
                    <div className="htpw-example-tile htpw-wrong-position">O</div>
                    <span>Correct letter, wrong position</span>
                  </div>
                  <div className="htpw-color-example">
                    <div className="htpw-example-tile htpw-incorrect">R</div>
                    <span>Letter not in word</span>
                  </div>
                </div>

                <div className="htpw-game-rules">
                  <h3>Rules</h3>
                  <ul>
                    <li>6 attempts to guess the word</li>
                    <li>Each guess must be a valid 5-letter word</li>
                    <li>Colors change after each guess</li>
                    <li>New puzzle daily</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Settings Modal */}
        {showSettings && (
          <div className="htpw-settings-modal">
            <div className="htpw-settings-content">
              <div className="htpw-settings-header">
                <h3>Settings</h3>
                <button 
                  className="htpw-close-btn"
                  onClick={toggleSettings}
                >
                  ×
                </button>
              </div>
              
              <div className="htpw-settings-body">
                <div className="htpw-setting-group">
                  <label className="htpw-setting-label">
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                    />
                    <span className="htpw-setting-icon">
                      {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </span>
                    Sound Effects
                  </label>
                </div>
              </div>

              <button 
                className="htpw-save-settings-btn"
                onClick={saveSettings}
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordleInstruction;