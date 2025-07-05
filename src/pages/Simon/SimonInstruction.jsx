import React, { useState, useEffect } from 'react';
import { Settings, Play, Gamepad2, ArrowLeft } from 'lucide-react';
import './SimonInstruction.css';
import { useNavigate } from 'react-router-dom';


const SimonInstruction = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [difficulty, setDifficulty] = useState('normal');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [demoSequence, setDemoSequence] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Colors for the Simon game
  const colors = ['red', 'green', 'blue', 'yellow'];
  
  const handleBackClick = () => {
  navigate(-1); // Go back to the previous page
};

  // Generate demo sequence
  useEffect(() => {
    const sequence = [];
    for (let i = 0; i < 4; i++) {
      sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    setDemoSequence(sequence);
  }, []);

  // Auto-play demo animation
  useEffect(() => {
    if (demoSequence.length > 0) {
      const interval = setInterval(() => {
        setIsPlaying(true);
        setCurrentStep(0);
        
        const playSequence = () => {
          demoSequence.forEach((color, index) => {
            setTimeout(() => {
              setCurrentStep(index + 1);
            }, (index + 1) * 800);
          });
          
          setTimeout(() => {
            setIsPlaying(false);
            setCurrentStep(0);
          }, demoSequence.length * 800 + 1000);
        };
        
        playSequence();
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [demoSequence]);
const navigate = useNavigate();

const handlePlayClick = () => {
  navigate('/simon-game');
};

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const getColorClass = (color) => {
    const isActive = isPlaying && currentStep > 0 && demoSequence[currentStep - 1] === color;
    return `simon-color-segment simon-${color} ${isActive ? 'active' : ''}`;
  };

  return (
    <div className="simon-instruction-page">
      
      
      <div className="simon-container">
       <header className="simon-header">
  <div className="simon-logo">
    <Gamepad2 size={40} color="var(--accent-color)" />
    <h1>Simon Game</h1>
  </div>
  <div style={{ display: 'flex', gap: '10px' }}>
    <button
      className="simon-back-btn"
      onClick={handleBackClick}
      aria-label="Back"
    >
      <ArrowLeft size={20} />
    </button>
    <button
      className="simon-settings-btn"
      onClick={toggleSettings}
      aria-label="Settings"
    >
      <Settings size={24} />
    </button>
  </div>
</header>

        <main className="simon-main-content">
          <div className='simon-game-preview-container'>
 <div className="simon-game-preview">
            <div className="game-theme-container">
              <div className="energy-core">
                <div className="core-inner">
                  <div className="pulse-ring pulse-1"></div>
                  <div className="pulse-ring pulse-2"></div>
                  <div className="pulse-ring pulse-3"></div>
                  <div className="core-center">
                    <Gamepad2 size={40} />
                  </div>
                </div>
              </div>
              <div className="floating-elements">
                <div className="element element-1"></div>
                <div className="element element-2"></div>
                <div className="element element-3"></div>
                <div className="element element-4"></div>
                <div className="element element-5"></div>
                <div className="element element-6"></div>
              </div>
              <div className="data-streams">
                <div className="stream stream-1"></div>
                <div className="stream stream-2"></div>
                <div className="stream stream-3"></div>
                <div className="stream stream-4"></div>
              </div>
              <div className="holographic-display">
                <div className="holo-text">READY</div>
                <div className="holo-bars">
                  <div className="bar bar-1"></div>
                  <div className="bar bar-2"></div>
                  <div className="bar bar-3"></div>
                  <div className="bar bar-4"></div>
                  <div className="bar bar-5"></div>
                </div>
              </div>
            </div>  
          </div>
<div className="simon-actions">
      <button className="simon-play-btn" onClick={handlePlayClick}>
        <Play size={20} />
        Start Playing
      </button>
    </div>

          </div>
         


          <div className="simon-instructions">
            <h2>How to Play</h2>
            <div className="simon-instruction-steps">
              <div className="simon-step">
                <div className="simon-step-number">1</div>
                <p>Watch the sequence of colored lights that flash</p>
              </div>
              <div className="simon-step">
                <div className="simon-step-number">2</div>
                <p>Repeat the sequence by clicking the colors in the same order</p>
              </div>
              <div className="simon-step">
                <div className="simon-step-number">3</div>
                <p>Each round adds one more color to the sequence</p>
              </div>
              <div className="simon-step">
                <div className="simon-step-number">4</div>
                <p>Keep going as long as you can remember the pattern!</p>
              </div>
            </div>

            <div className="simon-game-rules">
              <h3>Game Rules</h3>
              <ul>
                <li>The game starts with a single color flash</li>
                <li>You must repeat the entire sequence correctly to advance</li>
                <li>One wrong move ends the game</li>
                <li>Try to beat your high score!</li>
              </ul>
            </div>
          </div>

         
        </main>

        {showSettings && (
          <div className="simon-settings-modal">
            <div className="simon-settings-content">
              <div className="simon-settings-header">
                <h3>Game Settings</h3>
                <button 
                  className="simon-close-btn"
                  onClick={toggleSettings}
                >
                  ×
                </button>
              </div>
              
              <div className="simon-setting-group">
                <label>Difficulty Level</label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="simon-setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                  />
                  Enable Sound Effects
                </label>
              </div>

              <button 
                className="simon-save-settings-btn"
                onClick={toggleSettings}
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

export default SimonInstruction;