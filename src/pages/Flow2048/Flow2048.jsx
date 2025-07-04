import React, { useState, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import useSound from 'use-sound';
import slideSound from './sounds/slide.mp3';
import mergeSound from './sounds/merge.mp3';
import winSound from './sounds/win.mp3';
import loseSound from './sounds/lose.mp3';
import './Flow2048.css';

const BOARD_SIZE = 4;
const WINNING_VALUE = 2048;
const THEMES = {
  CLASSIC: 'classic',
  DARK: 'dark',
  NEON: 'neon',
  NATURE: 'nature'
};

const BACKGROUND_IMAGES = {
  [THEMES.CLASSIC]: '/bg-classic.jpg',
  [THEMES.DARK]: '/bg-dark.jpg',
  [THEMES.NEON]: '/bg-neon.jpg',
  [THEMES.NATURE]: '/bg-nature.jpg'
};

const Flow2048 = () => {
  const [grid, setGrid] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [theme, setTheme] = useState(THEMES.CLASSIC);
  const [showAnimations, setShowAnimations] = useState(true);
  const [movesCount, setMovesCount] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [playSlide] = useSound(slideSound, { volume: 0.5, soundEnabled: !isMuted });
  const [playMerge] = useSound(mergeSound, { volume: 0.7, soundEnabled: !isMuted });
  const [playWin] = useSound(winSound, { volume: 0.8, soundEnabled: !isMuted });
  const [playLose] = useSound(loseSound, { volume: 0.8, soundEnabled: !isMuted });

  useEffect(() => {
    const init = () => {
      const g = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
      const grid2 = addRandomTile(addRandomTile(g));
      setGrid(grid2);
      saveUndoState(grid2, 0);
    };
    init();
  }, []);

  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => setGameTime(t => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const addRandomTile = grid => {
    const empties = [];
    grid.forEach((r, i) => r.forEach((c, j) => { if (c === 0) empties.push({ i, j }); }));
    if (empties.length === 0) return grid;
    const { i, j } = empties[Math.floor(Math.random() * empties.length)];
    const newG = grid.map(r => [...r]);
    newG[i][j] = Math.random() < 0.9 ? 2 : 4;
    return newG;
  };

  const saveUndoState = (g, s) => {
    setUndoStack(u => [...u.slice(-4), { grid: g.map(r => [...r]), score: s }]);
  };

  const undoMove = () => {
    if (undoStack.length < 2) return;
    const prev = undoStack[undoStack.length - 2];
    setGrid(prev.grid);
    setScore(prev.score);
    setUndoStack(u => u.slice(0, -1));
    setGameOver(false);
    setWon(false);
    setMovesCount(m => m - 1);
  };

  const hasValidMoves = grid => {
    if (grid.some(r => r.includes(0))) return true;
    for (let i = 0; i < BOARD_SIZE; i++)
      for (let j = 0; j < BOARD_SIZE; j++) {
        const v = grid[i][j];
        if (j < BOARD_SIZE - 1 && grid[i][j + 1] === v) return true;
        if (i < BOARD_SIZE - 1 && grid[i + 1][j] === v) return true;
      }
    return false;
  };

  const moveTiles = useCallback(dir => {
    if (!grid || gameOver || isMoving) return;
    setIsMoving(true);
    setIsTimerRunning(true);

    let newGrid = grid.map(r => [...r]);
    let moved = false;
    let newScore = score;

    const process = row => {
      const arr = row.filter(x => x);
      for (let k = 0; k < arr.length - 1; k++) {
        if (arr[k] === arr[k + 1]) {
          arr[k] *= 2;
          newScore += arr[k];
          arr[k + 1] = 0;
          if (arr[k] === WINNING_VALUE) {
            setWon(true);
            playWin();
          }
          playMerge();
        }
      }
      const merged = arr.filter(x => x);
      while (merged.length < BOARD_SIZE) merged.push(0);
      return merged;
    };

    playSlide();

    if (dir === 'left') newGrid = newGrid.map(r => process(r));
    if (dir === 'right') newGrid = newGrid.map(r => process([...r].reverse()).reverse());
    if (dir === 'up') {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const col = process(newGrid.map(r => r[c]));
        newGrid.forEach((r, i) => r[c] = col[i]);
      }
    }
    if (dir === 'down') {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const col = process(newGrid.map(r => r[c]).reverse()).reverse();
        newGrid.forEach((r, i) => r[c] = col[i]);
      }
    }

    moved = JSON.stringify(newGrid) !== JSON.stringify(grid);

    if (moved) {
      setMovesCount(m => m + 1);
      setTimeout(() => {
        const withTile = addRandomTile(newGrid);
        setGrid(withTile);
        setScore(newScore);
        if (newScore > bestScore) setBestScore(newScore);
        saveUndoState(withTile, newScore);
        setIsMoving(false);
        if (!hasValidMoves(withTile)) {
          setGameOver(true);
          setIsTimerRunning(false);
          playLose();
        }
      }, showAnimations ? 120 : 0);
    } else {
      setIsMoving(false);
    }
  }, [grid, gameOver, isMoving, score, bestScore, showAnimations, isMuted]);

  useEffect(() => {
    const handler = e => {
      const key = e.key;
      if (key.startsWith('Arrow')) {
        e.preventDefault();
        moveTiles(key.replace('Arrow', '').toLowerCase());
      }
      if (key === 'z' && e.ctrlKey) undoMove();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [moveTiles]);

  const resetGame = () => {
    const g = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    const g2 = addRandomTile(addRandomTile(g));
    setGrid(g2);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setMovesCount(0);
    setGameTime(0);
    setIsTimerRunning(false);
    saveUndoState(g2, 0);
  };

  const formatTime = s => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => moveTiles('left'),
    onSwipedRight: () => moveTiles('right'),
    onSwipedUp: () => moveTiles('up'),
    onSwipedDown: () => moveTiles('down'),
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  if (!grid) return <div className="flow2048-loading">Loading game...</div>;

  return (
    <div
      className={`flow2048-game-container ${theme}`}
      style={{
        backgroundImage: `url('${BACKGROUND_IMAGES[theme]}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        maxWidth: '100wh',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: theme === THEMES.DARK ? 'rgba(0,0,0,0.6)' : 'rgba(31, 27, 27, 0)',
          zIndex: 0
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="flow2048-settings-container">
          <button 
            className="flow2048-settings-button"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️
          </button>
          
          {showSettings && (
            <div className="flow2048-settings-dropdown">
              <button 
                className={`flow2048-sound-button ${!isMuted ? 'active' : ''}`}
                onClick={() => setIsMuted(false)}
              >
                🔊 Unmute
              </button>
              <button 
                className={`flow2048-sound-button ${isMuted ? 'active' : ''}`}
                onClick={() => setIsMuted(true)}
              >
                🔇 Mute
              </button>
            </div>
          )}
        </div>

        <div className="flow2048-game-header">
          <div className="flow2048-title-container">
            <h1>2048</h1>
            <div className="flow2048-theme-selector">
              {Object.values(THEMES).map(t => (
                <button
                  key={t}
                  className={`flow2048-theme-btn ${theme === t ? 'active' : ''}`}
                  onClick={() => setTheme(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flow2048-stats-container">
            {['Score', 'Best', 'Moves', 'Time'].map(label => (
              <div key={label} className="flow2048-stat-box">
                <div className="flow2048-stat-label">{label}</div>
                <div className="flow2048-stat-value">
                  {label === 'Score' && score}
                  {label === 'Best' && bestScore}
                  {label === 'Moves' && movesCount}
                  {label === 'Time' && formatTime(gameTime)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flow2048-control-panel">
          <button className="flow2048-control-btn" onClick={resetGame}>New Game</button>
          <button className="flow2048-control-btn" onClick={undoMove} disabled={undoStack.length < 2}>Undo</button>
          
        </div>

        <div className="flow2048-game-board" {...handlers}>
          {grid.map((row, i) => (
            <React.Fragment key={i}>
              {row.map((val, j) => (
                <div
                  key={j}
                  className={`flow2048-block flow2048-block-${val} ${val !== 0 && showAnimations ? 'flow2048-block-appear' : ''}`}
                >
                  {val ? (
                    <>
                      <div className="flow2048-block-value">{val}</div>
                      {val >= 128 && (
                        <div
                          className="flow2048-block-glow"
                          style={{
                            opacity: Math.min(0.3 + (Math.log2(val) - 7) * 0.05, 0.8)
                          }}
                        />
                      )}
                    </>
                  ) : null}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {(gameOver || won) && (
          <div className="flow2048-game-overlay">
            <div className="flow2048-game-message">
              <h2>{won ? '🎉 You Win!' : '😢 Game Over'}</h2>
              <div className="flow2048-result-stats">
                <p>Score: {score}</p>
                <p>Moves: {movesCount}</p>
                <p>Time: {formatTime(gameTime)}</p>
              </div>
              <div className="flow2048-action-buttons">
                <button className="flow2048-action-btn flow2048-primary" onClick={resetGame}>Play Again</button>
                {won && (
                  <button className="flow2048-action-btn" onClick={() => setWon(false)}>Continue</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flow2048;