import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, Play, Zap, Shield } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  const audioContext = useRef(null);

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

  const buttonSounds = {
    0: 329.63,
    1: 261.63,
    2: 220.0,
    3: 196.0,
  };

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

  const navigate = useNavigate();
const handleBack = () => navigate(-1);

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

  const handleButtonClick = (buttonIndex) => {
    if (!isPlaying || isShowingSequence) return;
    playSound(buttonIndex, 200);
    setActiveButton(buttonIndex);
    setTimeout(() => setActiveButton(null), 200);
    const newPlayerSequence = [...playerSequence, buttonIndex];
    setPlayerSequence(newPlayerSequence);
    if (newPlayerSequence[newPlayerSequence.length - 1] !== gameSequence[newPlayerSequence.length - 1]) {
      if (gameMode === 'strict') {
        gameOverHandler();
      } else {
        playErrorSound();
        setPlayerSequence([]);
        setTimeout(() => {
          showSequence(gameSequence);
        }, 1000);
      }
      return;
    }
    if (newPlayerSequence.length === gameSequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      setLevel(Math.floor(newScore / 3) + 1);
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      if (newScore === 20) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }
      const newSequence = [...gameSequence, Math.floor(Math.random() * 4)];
      setGameSequence(newSequence);
      setPlayerSequence([]);
      setTimeout(() => {
        showSequence(newSequence);
      }, 1000);
    }
  };

  const gameOverHandler = () => {
    setGameOver(true);
    setIsPlaying(false);
    playErrorSound();
  };

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

  const selectGameMode = (mode) => {
    setGameMode(mode);
    if (isPlaying) resetGame();
  };

  const buttonConfig = [
    { index: 0, color: 'red', position: 'simon-game-button-top-right', bgColor: 'simon-button-red', activeColor: 'simon-button-red-active' },
    { index: 1, color: 'blue', position: 'simon-game-button-top-left', bgColor: 'simon-button-blue', activeColor: 'simon-button-blue-active' },
    { index: 2, color: 'yellow', position: 'simon-game-button-bottom-left', bgColor: 'simon-button-yellow', activeColor: 'simon-button-yellow-active' },
    { index: 3, color: 'green', position: 'simon-game-button-bottom-right', bgColor: 'simon-button-green', activeColor: 'simon-button-green-active' }
  ];

  return (
    <div className="simon-game">
      <div className="simon-animated-background">
        <div className="simon-pulse-circle-1"></div>
        <div className="simon-pulse-circle-2"></div>
        <div className="simon-pulse-circle-3"></div>
      </div>
      <div className="simon-particles-container">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="simon-particle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, animationDuration: `${2 + Math.random() * 2}s` }} />
        ))}
      </div>
      <div className="simon-game-container">
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
          <div className="simon-mode-toggle-wrapper">
          <div className="simon-mode-toggle-header" onClick={() => selectGameMode(gameMode === 'normal' ? 'strict' : 'normal')}>
            {gameMode === 'strict' ? <Zap size={16} style={{ color: '#f87171' }} /> : <Shield size={16} style={{ color: '#4ade80' }} />}
            {gameMode === 'strict' ? 'Strict Mode' : 'Normal Mode'}
          </div>
          </div>
          <div className="simon-score-container">
            <div className="simon-score-item">
              <span className="simon-high-score-label">High Score:</span>
              <span className="simon-high-score-value">{highScore}</span>
            </div>
           <div style={{ display: 'flex', gap: '0.5rem' }}>
  <button className="simon-back-button  " onClick={handleBack} aria-label="Back">
    <ArrowLeft size={18} />
  </button>
  <button onClick={() => setSoundEnabled(!soundEnabled)} className="simon-sound-toggle">
    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
  </button>
  <div className="simon-header-controls desktop-only">
  {!gameStarted || gameOver ? (
    <button onClick={startGame} className="simon-icon-circle" aria-label="Start">
      <Play size={18} />
    </button>
  ) : (
    <button onClick={resetGame} className="simon-icon-circle" aria-label="Reset">
      <RotateCcw size={18} />
    </button>
  )}
</div>
</div>



          </div>
        </header>
        <main>
          <div className="simon-game-title">
            <h1><span className="simon-simon-text">SIMON</span> <span className="simon-says-text">SAYS</span></h1>
          </div>
          {gameStarted && (
            <div className="simon-game-status">
              {isShowingSequence && <div className="simon-game-status-text simon-watching">Watch the sequence...</div>}
              {!isShowingSequence && isPlaying && <div className="simon-game-status-text simon-your-turn">Your turn! Repeat the sequence</div>}
              {gameOver && <div className="simon-game-status-text simon-game-over">{score === 20 ? 'Congratulations! You Win!' : `Game Over! Final Score: ${score}`}</div>}
            </div>
          )}
          <div className="simon-game-board">
            <div className="simon-simon-circle">
              <div className="simon-center-circle">
                <div className="simon-center-dot"></div>
              </div>
              {buttonConfig.map((button) => {
                const isActive = activeButton === button.index;
                const isDisabled = !isPlaying || isShowingSequence;
                return (
                  <button key={button.index} onClick={() => handleButtonClick(button.index)} disabled={isDisabled} className={`simon-game-button ${button.position} ${button.bgColor} ${isActive ? button.activeColor : ''}`}>
                    <div className="simon-button-inner">
                      {isActive && <div className="simon-button-active-indicator"></div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
         <div className="simon-controls mobile-only">
  {!gameStarted || gameOver ? (
    <button onClick={startGame} className="simon-control-button simon-start-button">
      <Play size={24} /> <span>{gameStarted ? 'Play Again' : 'Start Game'}</span>
    </button>
  ) : (
    <button onClick={resetGame} className="simon-control-button simon-reset-button">
      <RotateCcw size={24} /> <span>Reset</span>
    </button>
  )}
</div>

        </main>
      </div>
    </div>
  );
};

export default SimonGame;
