import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Howl } from 'howler';
import Confetti from 'react-confetti';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import './ChessGame.css';

Modal.setAppElement('#root');

const VictoryAnimation = () => {
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const createParticle = () => {
      if (!containerRef.current) return;
      
      const particle = {
        id: Math.random().toString(36).substr(2, 9),
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        size: `${Math.random() * 6 + 4}px`,
        duration: `${Math.random() * 2 + 2}s`
      };
      
      setParticles(prev => [...prev, particle]);
      
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== particle.id));
      }, 3000);
    };

    const interval = setInterval(createParticle, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chess-css-crown-animation" ref={containerRef}>
      <div className="chess-crown">👑</div>
      <div className="chess-crown-text">VICTORY!</div>
      {particles.map(particle => (
        <div 
          key={particle.id}
          className="chess-glitter-particle"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
            animationDelay: `${particle.delay}s`,
            animationDuration: particle.duration
          }}
        />
      ))}
    </div>
  );
};

const DrawAnimation = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    className="chess-draw-animation"
  >
    <h2>🤝 It's a Draw!</h2>
  </motion.div>
);

const PuzzleNotification = ({ puzzle }) => (
  <motion.div
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="chess-puzzle-notification"
  >
    🎉 You found a hidden puzzle: {puzzle.name}!
  </motion.div>
);

const ChessGame = () => {
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [game, setGame] = useState(new Chess());
  const [playerColor, setPlayerColor] = useState('white');
  const [gameStatus, setGameStatus] = useState('Start a new game!');
  const [aiThinking, setAiThinking] = useState(false);
  const [highlightedSquares, setHighlightedSquares] = useState({});
  const [moveHistory, setMoveHistory] = useState([]);
  const [aiDifficulty, setAiDifficulty] = useState(3);
  const [gameMode, setGameMode] = useState('ai');
  const [showConfetti, setShowConfetti] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ white: 300, black: 300 });
  const [boardTheme, setBoardTheme] = useState('default');
  const [explosion, setExplosion] = useState(null);
  const [foundPuzzles, setFoundPuzzles] = useState([]);
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('chessStats');
    return saved ? JSON.parse(saved) : { wins: 0, losses: 0, draws: 0 };
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const gameRef = useRef(game);
  const timerRef = useRef(null);
  const soundMove = useRef(null);
  const soundCapture = useRef(null);
  const soundCheck = useRef(null);
  const soundWin = useRef(null);
  const soundError = useRef(null);

  const themeClasses = {
    default: '',
    marble: 'chess-marble-theme',
    dark: 'chess-dark-theme',
    neon: 'chess-neon-theme'
  };

  const puzzlePositions = [
    { fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R', name: "Legal's Mate" },
    { fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R', name: "Fried Liver Attack" }
  ];

  useEffect(() => {
    gameRef.current = game;

    soundMove.current = new Howl({ src: ['/sounds/move.mp3'] });
    soundCapture.current = new Howl({ src: ['/sounds/capture.mp3'] });
    soundCheck.current = new Howl({ src: ['/sounds/check.mp3'] });
    soundWin.current = new Howl({ src: ['/sounds/win.mp3'] });
    soundError.current = new Howl({ src: ['/sounds/error.mp3'] });

    return () => {
      clearInterval(timerRef.current);
      soundMove.current.unload();
      soundCapture.current.unload();
      soundCheck.current.unload();
      soundWin.current.unload();
      soundError.current.unload();
    };
  }, []);

  useEffect(() => {
    // Update all sound volumes when mute state changes
    const volume = isMuted ? 0 : 1;
    if (soundMove.current) soundMove.current.volume(volume);
    if (soundCapture.current) soundCapture.current.volume(volume);
    if (soundCheck.current) soundCheck.current.volume(volume);
    if (soundWin.current) soundWin.current.volume(volume);
    if (soundError.current) soundError.current.volume(volume);
  }, [isMuted]);

  useEffect(() => {
    let interval;
    if (!game.isGameOver()) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const currentPlayer = game.turn() === 'w' ? 'white' : 'black';
          const newTime = { ...prev, [currentPlayer]: Math.max(0, prev[currentPlayer] - 1) };

          if (newTime[currentPlayer] <= 0) {
            clearInterval(interval);
            const winner = currentPlayer === 'white' ? 'black' : 'white';
            handleGameEnd({
              type: 'win',
              message: `${winner === 'white' ? 'White' : 'Black'} wins on time!`,
              winner
            });
          }

          return newTime;
        });
      }, 1000);
    }

    if (gameMode === 'ai' && !aiThinking && !game.isGameOver() && game.turn() !== playerColor[0]) {
      makeAIMove();
    }

    return () => clearInterval(interval);
  }, [game, gameMode, playerColor, aiThinking]);

  const handleGameEnd = (result) => {
    setGameStatus(result.message);
    clearInterval(timerRef.current);

    if (result.type === 'win') {
      setWinner(result.winner);
      if (!isMuted) soundWin.current.play();
      setShowConfetti(true);
      setShowWinModal(true);
      setTimeout(() => setShowConfetti(false), 5000);

      const isPlayerWin = gameMode === 'ai'
        ? result.winner === playerColor
        : result.winner === (game.turn() === 'w' ? 'black' : 'white');

      const newStats = {
        ...stats,
        wins: isPlayerWin ? stats.wins + 1 : stats.wins,
        losses: !isPlayerWin ? stats.losses + 1 : stats.losses
      };
      setStats(newStats);
      localStorage.setItem('chessStats', JSON.stringify(newStats));
    } else if (result.type === 'draw') {
      if (!isMuted) soundCheck.current.play();
      setWinner(null);
      setShowWinModal(true);
      
      const newStats = { ...stats, draws: stats.draws + 1 };
      setStats(newStats);
      localStorage.setItem('chessStats', JSON.stringify(newStats));
    }
  };

  const makeAIMove = () => {
    if (gameRef.current.isGameOver()) return;

    setAiThinking(true);

    setTimeout(() => {
      const possibleMoves = gameRef.current.moves({ verbose: true });
      const validMoves = possibleMoves.filter(move => {
        try {
          const testGame = new Chess(gameRef.current.fen());
          return testGame.move(move);
        } catch {
          return false;
        }
      });

      if (validMoves.length === 0) {
        setAiThinking(false);
        return;
      }

      let move;
      if (aiDifficulty === 1) {
        move = validMoves[Math.floor(Math.random() * validMoves.length)];
      } else {
        const captures = validMoves.filter(m => m.captured);
        move = captures.length > 0
          ? captures[Math.floor(Math.random() * captures.length)]
          : validMoves[Math.floor(Math.random() * validMoves.length)];
      }

      if (move) makeMove(move.from, move.to, move.promotion);
      setAiThinking(false);
    }, 500 + (5 - aiDifficulty) * 300);
  };

  const makeMove = (from, to, promotion = 'q') => {
    try {
      const newGame = new Chess(gameRef.current.fen());
      const move = newGame.move({ from, to, promotion });

      if (!move) {
        if (!isMuted) soundError.current.play();
        return false;
      }

      if (move.captured) {
        if (!isMuted) soundCapture.current.play();
        setExplosion(to);
        setTimeout(() => setExplosion(null), 300);
      } else {
        if (!isMuted) soundMove.current.play();
      }

      if (move.flags.includes('k') || move.flags.includes('q')) {
        document.querySelector(`[data-square=${to}]`).classList.add('chess-castle-animation');
      }
      
      if (move.flags.includes('e')) {
        document.querySelector(`[data-square=${to}]`).classList.add('chess-enpassant-animation');
      }

      const foundPuzzle = puzzlePositions.find(puzzle => puzzle.fen === newGame.fen());
      if (foundPuzzle && !foundPuzzles.includes(foundPuzzle.fen)) {
        setFoundPuzzles([...foundPuzzles, foundPuzzle.fen]);
      }

      setGame(newGame);
      gameRef.current = newGame;
      setMoveHistory(prev => [...prev, move.san]);
      setHighlightedSquares({});
      setPendingPromotion(null);

      if (newGame.isCheck() && !isMuted) soundCheck.current.play();
      updateGameStatus(newGame);

      setTimeout(() => {
        document.querySelectorAll('.chess-castle-animation, .chess-enpassant-animation').forEach(el => {
          el.classList.remove('chess-castle-animation', 'chess-enpassant-animation');
        });
      }, 1000);

      return true;
    } catch (e) {
      if (!isMuted) soundError.current.play();
      return false;
    }
  };

  const updateGameStatus = (chess) => {
    if (chess.isGameOver()) {
      if (chess.isCheckmate()) {
        handleGameEnd({
          type: 'win',
          message: `${chess.turn() === 'w' ? 'Black' : 'White'} wins by checkmate!`,
          winner: chess.turn() === 'w' ? 'black' : 'white'
        });
      } else if (chess.isDraw()) {
        let drawType = 'draw';
        let message = 'Game ended in a draw';
        
        if (chess.isStalemate()) {
          drawType = 'stalemate';
          message = 'Draw by stalemate';
        } else if (chess.isThreefoldRepetition()) {
          drawType = 'repetition';
          message = 'Draw by threefold repetition';
        } else if (chess.isInsufficientMaterial()) {
          drawType = 'material';
          message = 'Draw by insufficient material';
        }
        
        handleGameEnd({
          type: 'draw',
          drawType,
          message
        });
      }
    } else {
      setGameStatus(
        chess.isCheck()
          ? `Check! ${chess.turn() === 'w' ? 'Black' : 'White'} to move`
          : `${chess.turn() === 'w' ? 'White' : 'Black'} to move`
      );
    }
  };

  const onDrop = (sourceSquare, targetSquare, piece) => {
    if (gameMode === 'ai' && gameRef.current.turn() !== playerColor[0]) {
      if (!isMuted) soundError.current.play();
      return false;
    }

    const isPromotion = piece[1].toLowerCase() === 'p' &&
      ((piece[0] === 'w' && targetSquare[1] === '8') ||
       (piece[0] === 'b' && targetSquare[1] === '1'));

    if (isPromotion) {
      setPendingPromotion({ from: sourceSquare, to: targetSquare, color: piece[0] });
      return false;
    }

    return makeMove(sourceSquare, targetSquare);
  };

  const onSquareClick = (square) => {
    const moves = gameRef.current.moves({ square, verbose: true });
    if (moves.length === 0) return setHighlightedSquares({});

    const highlight = {};
    moves.forEach(move => {
      highlight[move.to] = {
        background: 'radial-gradient(var(--chess-highlight) 40%, transparent 50%)',
        borderRadius: '50%'
      };
    });
    setHighlightedSquares(highlight);
  };

  const startNewGame = (color = 'random') => {
    const newGame = new Chess();
    setGame(newGame);
    gameRef.current = newGame;
    setMoveHistory([]);
    setHighlightedSquares({});
    setTimeLeft({ white: 300, black: 300 });
    setShowConfetti(false);
    setWinner(null);
    setShowWinModal(false);
    clearInterval(timerRef.current);

    const playerColorChoice = color === 'random'
      ? Math.random() > 0.5 ? 'white' : 'black'
      : color;

    setPlayerColor(playerColorChoice);
    setGameStatus(`${playerColorChoice === 'white' ? 'White' : 'Black'} to move`);

    if (gameMode === 'ai' && playerColorChoice === 'black') {
      makeAIMove();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={`chess-container ${themeClasses[boardTheme]}`}>
      <div className="chess-bg-image" style={{ backgroundImage: 'url(/chess_bg.webp)' }}></div>
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      
      {foundPuzzles.length > 0 && (
        <PuzzleNotification puzzle={puzzlePositions.find(p => p.fen === foundPuzzles[foundPuzzles.length - 1])} />
      )}

      {pendingPromotion && (
        <div className="chess-promotion-modal">
          <div className="chess-promotion-options">
            {['q', 'r', 'b', 'n'].map((p) => (
              <img
                key={p}
                src={`https://chessboardjs.com/img/chesspieces/wikipedia/${pendingPromotion.color}${p.toUpperCase()}.png`}
                alt={p}
                onClick={() => {
                  makeMove(pendingPromotion.from, pendingPromotion.to, p);
                }}
              />
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={showWinModal}
        onRequestClose={() => setShowWinModal(false)}
        className="chess-win-modal"
        overlayClassName="chess-win-modal-overlay"
      >
        <div className="chess-win-modal-content">
          {winner ? <VictoryAnimation /> : <DrawAnimation />}
          <h2>{gameStatus}</h2>
          {!winner && (
            <>
              {gameStatus.includes('stalemate') && <p className="chess-draw-details">No legal moves available</p>}
              {gameStatus.includes('insufficient') && <p className="chess-draw-details">Not enough pieces to checkmate</p>}
              {gameStatus.includes('repetition') && <p className="chess-draw-details">Position repeated three times</p>}
            </>
          )}
          <button
            className="chess-new-game-btn"
            onClick={() => {
              setShowWinModal(false);
              startNewGame();
            }}
          >
            New Game
          </button>
        </div>
      </Modal>

      <div className="chess-header">
        <h1>Chess Master</h1>
        <div className="chess-game-modes">
          <button
            onClick={() => { setGameMode('ai'); startNewGame(); }}
            className={gameMode === 'ai' ? 'active' : ''}
          >
            vs AI
          </button>
          <button
            onClick={() => { setGameMode('local'); startNewGame(); }}
            className={gameMode === 'local' ? 'active' : ''}
          >
            Local Multiplayer
          </button>
          <div className="chess-header-buttons">
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="chess-back-button"
            >
              ← Back to Home
            </button>
            <div className="chess-settings-container">
              <button 
                className="chess-settings-button" 
                onClick={() => setShowSettings(!showSettings)}
              >
                ⚙️
              </button>
              {showSettings && (
                <div className="chess-settings-dropdown">
                  <button 
                    className={`chess-sound-button ${isMuted ? '' : 'active'}`}
                    onClick={toggleMute}
                  >
                    {isMuted ? '🔇 Unmute' : '🔊 Mute'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="chess-game-area">
        <div className={`chess-player-info chess-white ${game.turn() === 'w' ? 'active' : ''} ${winner === 'white' ? 'winner' : ''}`}>
          <div className="chess-player-avatar chess-white">
            ♔
          </div>
          <div className="chess-timer-container">
            <div className={`chess-timer ${timeLeft.white < 60 ? 'low-time' : ''}`}>
              {formatTime(timeLeft.white)}
            </div>
          </div>
          <div className="chess-player-meta">
            <h3>White {gameMode === 'ai' && playerColor === 'white' ? '(You)' : ''}</h3>
            {winner === 'white' && <div className="chess-crown">👑</div>}
          </div>
        </div>

        <div className="chess-chessboard-wrapper chess-with-animations">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            onSquareClick={onSquareClick}
            boardWidth={500}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.3s ease'
            }}
            customDarkSquareStyle={{ backgroundColor: 'var(--chess-dark-square)' }}
            customLightSquareStyle={{ backgroundColor: 'var(--chess-light-square)' }}
            boardOrientation={playerColor === 'black' ? 'black' : 'white'}
            customSquareStyles={{
              ...highlightedSquares,
              ...(explosion ? {
                [explosion]: {
                  background: 'radial-gradient(circle, rgba(255,0,0,0.8) 0%, transparent 70%)'
                }
              } : {})
            }}
            areCoordinates={true}
          />
          <div className="chess-game-status-mobile">
            <h3>{gameStatus}</h3>
          </div>
        </div>

        <div className={`chess-player-info chess-black ${game.turn() === 'b' ? 'active' : ''} ${winner === 'black' ? 'winner' : ''}`}>
          <div className="chess-player-avatar chess-black">
            ♚
          </div>
          <div className="chess-timer-container">
            <div className={`chess-timer ${timeLeft.black < 60 ? 'low-time' : ''}`}>
              {formatTime(timeLeft.black)}
            </div>
          </div>
          <div className="chess-player-meta">
            <h3>Black {gameMode === 'ai' && playerColor === 'black' ? '(You)' : ''}</h3>
            {winner === 'black' && <div className="chess-crown">👑</div>}
          </div>
          {aiThinking && game.turn() === 'w' && <div className="chess-ai-thinking">AI is thinking...</div>}
        </div>
      </div>

      <div className="chess-controls">
        <div className="chess-settings">
          <div className="chess-setting-group">
            <label>AI Difficulty:</label>
            <select
              value={aiDifficulty}
              onChange={(e) => setAiDifficulty(Number(e.target.value))}
              disabled={gameMode !== 'ai'}
            >
              <option value={1}>Easy</option>
              <option value={3}>Medium</option>
              <option value={5}>Hard</option>
            </select>
          </div>

          <div className="chess-setting-group">
            <label>Board Theme:</label>
            <select
              value={boardTheme}
              onChange={(e) => setBoardTheme(e.target.value)}
            >
              <option value="default">Wood</option>
              <option value="marble">Marble</option>
              <option value="dark">Dark Mode</option>
              <option value="neon">Neon</option>
            </select>
          </div>

          <div className="chess-setting-group">
            <label>Play as:</label>
            <div className="chess-color-buttons">
              <button onClick={() => startNewGame('white')}>White</button>
              <button onClick={() => startNewGame('black')}>Black</button>
              <button onClick={() => startNewGame('random')}>Random</button>
            </div>
          </div>

          <button onClick={() => startNewGame()} className="chess-new-game-btn">
            New Game
          </button>
        </div>

        <div className="chess-move-history-container">
          <div className="chess-game-status-desktop">
            <h3>{gameStatus}</h3>
          </div>
          <div className="chess-move-history">
            <h4>Move History</h4>
            <div className="chess-moves">
              {moveHistory.map((move, i) => (
                <span key={i}>{i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : ''} {move} </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;