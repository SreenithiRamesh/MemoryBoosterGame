import React, { useState, useEffect, useRef } from 'react';
import './SimonGame.css';

const SimonGame = () => {
    const [sequence, setSequence] = useState([]);
    const [playerSequence, setPlayerSequence] = useState([]);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [canClick, setCanClick] = useState(false);
    const [strictMode, setStrictMode] = useState(false);
    const [displayMessage, setDisplayMessage] = useState('Start');
    const [showScorePopup, setShowScorePopup] = useState(false);
    const [popupEmoji, setPopupEmoji] = useState('✨');
    const [showerElements, setShowerElements] = useState([]);

    // Refs for game elements
    const gameBoardRef = useRef(null);
    const greenRef = useRef(null);
    const redRef = useRef(null);
    const yellowRef = useRef(null);
    const blueRef = useRef(null);

    // --- Game Logic ---

    useEffect(() => {
        if (gameStarted) {
            setDisplayMessage('Go!');
            setScore(0);
            setSequence([]);
            setPlayerSequence([]);
            setShowScorePopup(false);
            setShowerElements([]);

            if (gameBoardRef.current) {
                gameBoardRef.current.style.opacity = '0';
                gameBoardRef.current.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    gameBoardRef.current.classList.add('start-animation');
                }, 50);
            }

            setTimeout(() => {
                if (gameBoardRef.current) {
                    gameBoardRef.current.classList.remove('start-animation');
                    gameBoardRef.current.style.opacity = '1';
                    gameBoardRef.current.style.transform = 'scale(1)';
                }
                generateNextSequence();
            }, 1000);
        } else {
            setCanClick(false);
            setShowScorePopup(false);
            setShowerElements([]);
        }
    }, [gameStarted]);

    useEffect(() => {
        if (sequence.length > 0 && gameStarted) {
            playSequence(sequence);
        }
    }, [sequence, gameStarted]);

    useEffect(() => {
        if (gameStarted && score > 0) {
            const emojis = ['✨', '🎉', '🌟', '👍', '💡', '🥳', '🚀'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            setPopupEmoji(randomEmoji);
            setShowScorePopup(true);

            const showerEmojis = ['⭐', '💫', '💖'];
            const newShowerElement = {
                id: Date.now() + Math.random(),
                emoji: showerEmojis[Math.floor(Math.random() * showerEmojis.length)],
                left: Math.random() * 90 + 5 + '%'
            };
            setShowerElements(prev => [...prev, newShowerElement]);

            setTimeout(() => {
                setShowerElements(prev => prev.filter(el => el.id !== newShowerElement.id));
            }, 1500);

            const timer = setTimeout(() => {
                setShowScorePopup(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [score, gameStarted]);

    const startGame = () => {
        setGameStarted(true);
    };

    const newGame = () => {
        setGameStarted(false);
        setSequence([]);
        setPlayerSequence([]);
        setScore(0);
        setCanClick(false);
        setStrictMode(false);
        setDisplayMessage('Press Start');
        setShowScorePopup(false);
        setShowerElements([]);
        if (gameBoardRef.current) {
            gameBoardRef.current.style.opacity = '1';
            gameBoardRef.current.style.transform = 'scale(1)';
        }
    };

    const restartGame = () => {
        newGame();
        setDisplayMessage('Start');
    };

    const generateNextSequence = () => {
        setCanClick(false);
        const colors = ['red', 'green', 'yellow', 'blue'];
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        const newSequence = [...sequence, newColor];
        setSequence(newSequence);
        setDisplayMessage(newSequence.length.toString());
    };

    const playSequence = (seq) => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < seq.length) {
                highlightColor(seq[i]);
                i++;
            } else {
                clearInterval(interval);
                setCanClick(true);
                setDisplayMessage('Your Turn');
            }
        }, 800);
    };

    const highlightColor = (color) => {
        const ref = {
            'green': greenRef,
            'red': redRef,
            'yellow': yellowRef,
            'blue': blueRef
        }[color];
        
        if (ref.current) {
            ref.current.classList.add('active');
            setTimeout(() => {
                ref.current.classList.remove('active');
            }, 300);
        }
    };

    const handlePlayerClick = (color) => {
        if (!gameStarted || !canClick) return;

        const ref = {
            'green': greenRef,
            'red': redRef,
            'yellow': yellowRef,
            'blue': blueRef
        }[color];
        
        if (ref.current) {
            ref.current.classList.add('pressed');
            setTimeout(() => {
                ref.current.classList.remove('pressed');
            }, 150);
        }

        highlightColor(color);
        const newPlayerSequence = [...playerSequence, color];
        setPlayerSequence(newPlayerSequence);

        const currentIndex = newPlayerSequence.length - 1;
        if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
            setDisplayMessage('FAIL!');
            setCanClick(false);
            setShowScorePopup(false);
            setShowerElements([]);

            if (strictMode) {
                setTimeout(() => {
                    setDisplayMessage('Game Over!');
                    setGameStarted(false);
                }, 1500);
            } else {
                setTimeout(() => {
                    setDisplayMessage('Try Again!');
                    setPlayerSequence([]);
                    playSequence(sequence);
                }, 1500);
            }
            return;
        }

        if (newPlayerSequence.length === sequence.length) {
            setScore(score + 1);
            setPlayerSequence([]);
            setDisplayMessage('Well Done!');
            setCanClick(false);
            setTimeout(generateNextSequence, 1000);
        }
    };

    const toggleStrictMode = () => {
        if (!gameStarted) {
            setStrictMode(!strictMode);
        }
    };

    return (
        <div className="simon-game-wrapper">
            <div className="simon-game-top-controls">
                <div className="simon-game-top-display-message">{displayMessage}</div>
                <div className="simon-game-top-score-display">Score: {score}</div>
                <button
                    className="simon-game-button simon-game-top-start-button"
                    onClick={startGame}
                    disabled={gameStarted}
                >
                    Start
                </button>
                <button className="simon-game-button simon-game-top-restart-button" onClick={restartGame}>
                    Restart
                </button>
                <button
                    className={`simon-game-button simon-game-top-strict-button ${strictMode ? 'active' : ''}`}
                    onClick={toggleStrictMode}
                    disabled={gameStarted}
                >
                    Strict
                </button>
            </div>

            <div className="simon-game-board" ref={gameBoardRef}>
                <div
                    ref={greenRef}
                    className="simon-game-quadrant green"
                    onClick={() => handlePlayerClick('green')}
                ></div>
                <div
                    ref={redRef}
                    className="simon-game-quadrant red"
                    onClick={() => handlePlayerClick('red')}
                ></div>
                <div
                    ref={yellowRef}
                    className="simon-game-quadrant yellow"
                    onClick={() => handlePlayerClick('yellow')}
                ></div>
                <div
                    ref={blueRef}
                    className="simon-game-quadrant blue"
                    onClick={() => handlePlayerClick('blue')}
                ></div>

                <div className="simon-game-center-panel">
                    <div className="simon-game-title">SIMON</div>
                    {showScorePopup && (
                        <div className="simon-game-score-popup">
                            +1 {popupEmoji}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimonGame;
