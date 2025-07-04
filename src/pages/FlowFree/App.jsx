import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import confetti from 'canvas-confetti';

const FlowFreeGame = () => {
  // Game configuration
  const [level, setLevel] = useState(1);
  const [boardSize, setBoardSize] = useState(5);
  const [colors, setColors] = useState(3);
  const [board, setBoard] = useState([]);
  const [dots, setDots] = useState([]);
  const [paths, setPaths] = useState({});
  const [gameWon, setGameWon] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const boardRef = useRef(null);

  // Initialize the game board
  useEffect(() => {
    initializeBoard();
  }, [level, boardSize, colors]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isPlaying && !gameWon) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameWon]);

  const initializeBoard = () => {
    const newBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
    const colorList = generateRandomColors(colors);
    const newDots = [];
    
    colorList.forEach(color => {
      for (let i = 0; i < 2; i++) {
        let row, col;
        do {
          row = Math.floor(Math.random() * boardSize);
          col = Math.floor(Math.random() * boardSize);
        } while (newBoard[row][col] !== null);
        
        newBoard[row][col] = { color, isDot: true };
        newDots.push({ row, col, color });
      }
    });
    
    setBoard(newBoard);
    setDots(newDots);
    setPaths({});
    setGameWon(false);
    setCurrentColor(null);
    setCurrentPath([]);
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
    setError(null);
    setShowWinPopup(false);
  };

  const generateRandomColors = (count) => {
    const colorOptions = [
      '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE',
      '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE',
      '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40'
    ];
    
    return colorOptions.slice(0, count);
  };

  const handleCellMouseEnter = (row, col) => {
    if (!currentColor || gameWon || !isPlaying) return;
    setError(null);

    // Check if we're trying to connect to the other dot of the same color
    const otherDot = findOtherDot(currentPath[0].row, currentPath[0].col, currentColor);
    if (otherDot && otherDot.row === row && otherDot.col === col) {
      const lastCell = currentPath[currentPath.length - 1];
      const rowDiff = Math.abs(row - lastCell.row);
      const colDiff = Math.abs(col - lastCell.col);
      
      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        const newPath = [...currentPath, { row, col }];
        
        if (!isPathValid(newPath)) {
          setError("Paths cannot cross each other!");
          return;
        }
        
        if (paths[currentColor]) {
          setError("Each color can only have one path!");
          return;
        }
        
        setCurrentPath(newPath);
        completePath(newPath, currentColor);
      }
      return;
    }

    const existingIndex = currentPath.findIndex(p => p.row === row && p.col === col);
    if (existingIndex >= 0) {
      setCurrentPath(currentPath.slice(0, existingIndex + 1));
      setMoves(moves + 1);
      return;
    }

    if (currentPath.length > 0) {
      const lastCell = currentPath[currentPath.length - 1];
      const rowDiff = Math.abs(row - lastCell.row);
      const colDiff = Math.abs(col - lastCell.col);

      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        if (!board[row][col]) {
          const newPath = [...currentPath, { row, col }];
          
          if (!isPathValid(newPath)) {
            setError("Paths cannot cross each other!");
            return;
          }
          
          setCurrentPath(newPath);
          setMoves(moves + 1);
        } else {
          setError("Cell already occupied!");
        }
      } else {
        setError("Only adjacent cells can be connected!");
      }
    }
  };

  const isPathValid = (path) => {
    for (let i = 1; i < path.length; i++) {
      const prev = path[i-1];
      const curr = path[i];
      
      if (prev.row !== curr.row && prev.col !== curr.col) {
        return false;
      }
      
      if (board[curr.row][curr.col] && !board[curr.row][curr.col].isDot) {
        return false;
      }
    }
    return true;
  };

  const handleDotClick = (row, col, color) => {
    if (gameWon || !isPlaying) return;
    setError(null);

    if (currentColor === color && currentPath.length > 0) {
      setCurrentPath([{ row, col }]);
      return;
    }

    setCurrentColor(color);
    setCurrentPath([{ row, col }]);
  };

  const completePath = (path, color) => {
    const newPaths = { ...paths, [color]: path };
    setPaths(newPaths);
    
    const newBoard = [...board];
    path.forEach(pos => {
      if (!newBoard[pos.row][pos.col] || !newBoard[pos.row][pos.col].isDot) {
        newBoard[pos.row][pos.col] = { color, isDot: false };
      }
    });
    setBoard(newBoard);
    
    setCurrentColor(null);
    setCurrentPath([]);
    
    checkGameCompletion();
  };

  const findOtherDot = (row, col, color) => {
    return dots.find(dot => 
      dot.color === color && !(dot.row === row && dot.col === col)
    );
  };

  const checkGameCompletion = () => {
  const allColorsConnected = dots.every(dot => {
    const path = paths[dot.color];
    if (!path) return false;
    
    const startDot = path[0];
    const endDot = path[path.length - 1];
    const otherDot = findOtherDot(startDot.row, startDot.col, dot.color);
    
    return (endDot.row === otherDot.row && endDot.col === otherDot.col);
  });
  
  const allCellsFilled = board.every(row => 
    row.every(cell => cell !== null)
  );
  
  if (allColorsConnected && allCellsFilled) {
    setGameWon(true);
    setIsPlaying(false);
    setShowWinPopup(true);
    
    // Play confetti effect
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      });
    }
    
    // Play win sound
    const winSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
    winSound.play().catch(e => console.log("Audio play failed:", e));
  }
};

  const resetGame = () => {
    initializeBoard();
  };

  const nextLevel = () => {
    setLevel(level + 1);
    if (level % 3 === 0 && boardSize < 9) {
      setBoardSize(boardSize + 1);
    }
    if (level % 2 === 0 && colors < 6) {
      setColors(colors + 1);
    }
    initializeBoard();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getCellPosition = (row, col) => {
    if (!boardRef.current) return { x: 0, y: 0 };
    const cellSize = boardRef.current.clientWidth / boardSize;
    return {
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2
    };
  };

  const generatePathData = (path) => {
    if (path.length < 2) return '';

    let d = '';
    path.forEach((pos, index) => {
      const { x, y } = getCellPosition(pos.row, pos.col);
      if (index === 0) {
        d = `M ${x} ${y}`;
      } else {
        d += ` L ${x} ${y}`;
      }
    });

    return d;
  };

  return (
    <div className="app" style={{ 
      backgroundImage: 'url(https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1000&auto=format&fit=crop)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="game-content">
        <div className="header">
          <h1>Flow Free</h1>
          <div className="game-info">
            <div className="info-item">
              <span className="info-label">Level:</span>
              <span className="info-value">{level}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Board:</span>
              <span className="info-value">{boardSize}×{boardSize}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Flows:</span>
              <span className="info-value">
                {Object.keys(paths).length}/{colors}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Moves:</span>
              <span className="info-value">{moves}</span>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="controls">
            <button onClick={resetGame}>New Game</button>
            <div className="settings">
              <label>
                Board Size:
                <select 
                  value={boardSize} 
                  onChange={(e) => setBoardSize(parseInt(e.target.value))}
                >
                  {[4, 5, 6, 7, 8, 9].map(size => (
                    <option key={size} value={size}>{size}×{size}</option>
                  ))}
                </select>
              </label>
              <label>
                Colors:
                <select 
                  value={colors} 
                  onChange={(e) => setColors(parseInt(e.target.value))}
                >
                  {[3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        {showWinPopup && (
  <div className="win-popup-overlay">
    <div className="win-popup">
      <div className="confetti-container"></div>
      <h2 className="win-title">🎉 Level Complete! 🎉</h2>
      <div className="trophy-icon">🏆</div>
      <div className="win-stats">
        <p><span className="stat-icon">⏱️</span> Time: {formatTime(time)}</p>
        <p><span className="stat-icon">🔄</span> Moves: {moves}</p>
        <p><span className="stat-icon">⭐</span> Level: {level}</p>
      </div>
      <div className="congrats-message">
        Amazing! You solved it in {formatTime(time)} with {moves} moves!
      </div>
      <div className="win-buttons">
        <button className="next-level-btn" onClick={nextLevel}>
          Next Level ({level + 1})
        </button>
        <button className="play-again-btn" onClick={resetGame}>
          Play Again
        </button>
      </div>
    </div>
  </div>
)}

        <div className="game-container">
          <div 
            className="game-board" 
            style={{ '--size': boardSize }}
            ref={boardRef}
          >
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="board-row">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className={`cell ${cell && cell.isDot ? 'dot' : ''}`}
                    onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                  >
                    {cell && cell.isDot && (
                      <div 
                        className="dot-inner" 
                        style={{ backgroundColor: cell.color }}
                        onClick={() => handleDotClick(rowIndex, colIndex, cell.color)}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}

            <svg className="paths-overlay">
              {Object.entries(paths).map(([color, path]) => (
                <path
                  key={color}
                  stroke={color}
                  strokeWidth="5%"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  d={generatePathData(path)}
                />
              ))}
            </svg>

            {currentPath.length > 1 && (
              <svg className="current-path-overlay">
                <path
                  stroke={currentColor}
                  strokeWidth="5%"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  d={generatePathData(currentPath)}
                />
              </svg>
            )}
          </div>
        </div>

        <div className="instructions">
          <p>Click on a dot to start connecting, then hover over adjacent cells</p>
          <p>Connect all matching pairs to complete the level (no empty cells allowed)</p>
        </div>
      </div>
    </div>
  );
};

export default FlowFreeGame;