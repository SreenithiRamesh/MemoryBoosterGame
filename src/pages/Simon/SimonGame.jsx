import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, Play, Zap, Shield } from 'lucide-react';
import './SimonGame.css';

const SimonGame = () => {
  const [gameSequence, setGameSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('normal');
  const [isGameModeSelectionOpen, setIsGameModeSelectionOpen] = useState(false);

  const audioContext = useRef(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && soundEnabled) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [soundEnabled]);

  // Sound frequencies for each button
  const buttonSounds = {
    0: 329.63, // E4 - Red
    1: 261.63, // C4 - Blue  
    2: 220.00, // A3 - Yellow
    3: 196.00  // G3 - Green
  };

  // Play sound for button
  const playSound = (buttonIndex, duration = 300) => {
    if (!soundEnabled || !audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.value = buttonSounds[buttonIndex];
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + duration / 1000);
    
    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + duration / 1000);
  };

  // Play error sound
  const playErrorSound = () => {
    if (!soundEnabled || !audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.value = 150;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.5);
  };

  // Start new game
  const startGame = () => {
    const newSequence = [Math.floor(Math.random() * 4)];
    setGameSequence(newSequence);
    setPlayerSequence([]);
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setIsPlaying(true);
    setGameStarted(true);
    showSequence(newSequence);
  };

  // Show sequence to player
  const showSequence = async (sequence) => {
    setIsShowingSequence(true);
    setActiveButton(null);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setActiveButton(sequence[i]);
      playSound(sequence[i], 400);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveButton(null);
    }
    
    setIsShowingSequence(false);
  };

  // Handle button click
  const handleButtonClick = (buttonIndex) => {
    if (!isPlaying || isShowingSequence) return;

    playSound(buttonIndex, 200);
    setActiveButton(buttonIndex);
    setTimeout(() => setActiveButton(null), 200);

    const newPlayerSequence = [...playerSequence, buttonIndex];
    setPlayerSequence(newPlayerSequence);

    // Check if button press is correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== gameSequence[newPlayerSequence.length - 1]) {
      // Wrong button pressed
      if (gameMode === 'strict') {
        gameOverHandler();
      } else {
        // Normal mode - replay the sequence
        playErrorSound();
        setPlayerSequence([]);
        setTimeout(() => {
          showSequence(gameSequence);
        }, 1000);
      }
      return;
    }

    // Check if player completed the sequence
    if (newPlayerSequence.length === gameSequence.length) {
      // Correct sequence completed
      const newScore = score + 1;
      setScore(newScore);
      setLevel(Math.floor(newScore / 3) + 1);
      
      if (newScore > highScore) {
        setHighScore(newScore);
      }

      // Check for win condition (score 20)
      if (newScore === 20) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }

      // Add new button to sequence
      const newSequence = [...gameSequence, Math.floor(Math.random() * 4)];
      setGameSequence(newSequence);
      setPlayerSequence([]);
      
      setTimeout(() => {
        showSequence(newSequence);
      }, 1000);
    }
  };

  // Handle game over
  const gameOverHandler = () => {
    setGameOver(true);
    setIsPlaying(false);
    playErrorSound();
  };

  // Reset game
  const resetGame = () => {
    setGameSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setIsPlaying(false);
    setGameStarted(false);
    setActiveButton(null);
    setIsShowingSequence(false);
  };

  // Toggle game mode selection
  const toggleGameModeSelection = () => {
    setIsGameModeSelectionOpen(!isGameModeSelectionOpen);
  };

  // Select game mode
  const selectGameMode = (mode) => {
    setGameMode(mode);
    setIsGameModeSelectionOpen(false);
    if (isPlaying) {
      resetGame();
    }
  };

  const buttonConfig = [
    { index: 0, color: 'red', position: 'simon-game-button-top-right', bgColor: 'simon-button-red', activeColor: 'simon-button-red-active' },
    { index: 1, color: 'blue', position: 'simon-game-button-top-left', bgColor: 'simon-button-blue', activeColor: 'simon-button-blue-active' },
    { index: 2, color: 'yellow', position: 'simon-game-button-bottom-left', bgColor: 'simon-button-yellow', activeColor: 'simon-button-yellow-active' },
    { index: 3, color: 'green', position: 'simon-game-button-bottom-right', bgColor: 'simon-button-green', activeColor: 'simon-button-green-active' }
  ];

  return (
    <div className="simon-game">
      {/* Animated Background */}
      <div className="simon-animated-background">
        <div className="simon-pulse-circle-1"></div>
        <div className="simon-pulse-circle-2"></div>
        <div className="simon-pulse-circle-3"></div>
      </div>

      {/* Floating Particles */}
      <div className="simon-particles-container">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="simon-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Game Container */}
      <div className="simon-game-container">
        {/* Header */}
        <header className="simon-game-header">
          <div className="simon-score-container">
            <div className="simon-score-item">
              <span className="simon-score-label">Score:</span>
              <span className="simon-score-value">{score}</span>
            </div>
            <div className="simon-score-item">
              <span className="simon-level-label">Level:</span>
              <span className="simon-level-value">{level}</span>
            </div>
          </div>
          
          <div className="simon-score-container">
            <div className="simon-score-item">
              <span className="simon-high-score-label">High Score:</span>
              <span className="simon-high-score-value">{highScore}</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="simon-sound-toggle"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
        </header>

        {/* Main Game Area */}
        <main>
          {/* Game Title */}
          <div className="simon-game-title">
            <h1>
              <span className="simon-simon-text">SIMON</span>
              <span className="simon-says-text">SAYS</span>
            </h1>
            <p className="simon-game-subtitle">
              Test your memory! Watch the sequence and repeat it back.
            </p>
          </div>

          {/* Game Mode Selection */}
          <div className="simon-game-mode-container">
            <div className="simon-game-mode-selector">
              <button
                onClick={toggleGameModeSelection}
                className="simon-game-mode-button"
              >
                {gameMode === 'strict' ? (
                  <Zap size={20} className="simon-mode-icon simon-strict" />
                ) : (
                  <Shield size={20} className="simon-mode-icon simon-normal" />
                )}
                <span className="simon-mode-text">
                  {gameMode === 'strict' ? 'Strict Mode' : 'Normal Mode'}
                </span>
              </button>
              
              {isGameModeSelectionOpen && (
                <div className="simon-mode-options">
                  <button
                    onClick={() => selectGameMode('normal')}
                    className={`simon-mode-option ${gameMode === 'normal' ? 'simon-selected' : ''}`}
                  >
                    <Shield size={16} className="simon-mode-option-icon simon-normal" />
                    <div>
                      <div className="simon-mode-option-name">Normal Mode</div>
                      <div className="simon-mode-option-desc">Replays sequence on mistake</div>
                    </div>
                  </button>
                  <button
                    onClick={() => selectGameMode('strict')}
                    className={`simon-mode-option ${gameMode === 'strict' ? 'simon-selected' : ''}`}
                  >
                    <Zap size={16} className="simon-mode-option-icon simon-strict" />
                    <div>
                      <div className="simon-mode-option-name">Strict Mode</div>
                      <div className="simon-mode-option-desc">Game over on mistake</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Game Status */}
          {gameStarted && (
            <div className="simon-game-status">
              {isShowingSequence && (
                <div className="simon-game-status-text simon-watching">
                  Watch the sequence...
                </div>
              )}
              {!isShowingSequence && isPlaying && (
                <div className="simon-game-status-text simon-your-turn">
                  Your turn! Repeat the sequence
                </div>
              )}
              {gameOver && (
                <div className="simon-game-status-text simon-game-over">
                  {score === 20 ? 'Congratulations! You Win!' : `Game Over! Final Score: ${score}`}
                </div>
              )}
            </div>
          )}

          {/* Game Board */}
          <div className="simon-game-board">
            <div className="simon-simon-circle">
              {/* Center Circle */}
              <div className="simon-center-circle">
                <div className="simon-center-dot"></div>
              </div>

              {/* Game Buttons */}
              {buttonConfig.map((button) => {
                const isActive = activeButton === button.index;
                const isDisabled = !isPlaying || isShowingSequence;

                return (
                  <button
                    key={button.index}
                    onClick={() => handleButtonClick(button.index)}
                    disabled={isDisabled}
                    className={`
                      simon-game-button ${button.position} ${button.bgColor}
                      ${isActive ? button.activeColor : ''}
                    `}
                  >
                    <div className="simon-button-inner">
                      {isActive && (
                        <div className="simon-button-active-indicator"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="simon-controls">
            {!gameStarted || gameOver ? (
              <button
                onClick={startGame}
                className="simon-control-button simon-start-button"
              >
                <Play size={24} />
                <span>{gameStarted ? 'Play Again' : 'Start Game'}</span>
              </button>
            ) : (
              <button
                onClick={resetGame}
                className="simon-control-button simon-reset-button"
              >
                <RotateCcw size={24} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Instructions */}
          {!gameStarted && (
            <div className="simon-instructions">
              <h3 className="simon-instructions-title">How to Play:</h3>
              <p className="simon-instructions-text">
                Watch the sequence of colors, then click the buttons in the same order. 
                The sequence gets longer each round! Reach score 20 to win!
              </p>
              <div className="simon-mode-description">
                <p><strong>Normal Mode:</strong> Mistakes replay the sequence</p>
                <p><strong>Strict Mode:</strong> Any mistake ends the game</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SimonGame;