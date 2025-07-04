import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Row from "../components/Row";
import { getFeedback } from "../utils/getFeedback";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { FaKeyboard, FaUndo, FaArrowLeft, FaTrophy } from "react-icons/fa";
import './Wordle.css'

// Sound Effects
const successSound = new Audio("/sounds/success.mp3");
const failSound = new Audio("/sounds/fail.mp3");
const restartSound = new Audio("/sounds/restart.mp3");

// Word lists remain exactly the same
const wordLists = {
  easy: [
    "apple", "candy", "train", "light", "cloud", "plant", "river", 
    "happy", "smile", "music", "beach", "dance", "earth", "fruit", 
    "grape", "house", "juice", "knife", "lemon", "mango"
  ],
  medium: [
    "planet", "camera", "guitar", "puzzle", "rocket", "jungle", 
    "wizard", "oxygen", "voyage", "zodiac", "basket", "dragon", 
    "flower", "garden", "island", "jacket", "kettle", "laptop"
  ],
  hard: [
    "quantum", "jazzily", "buzzing", "jukebox", "quizzed", 
    "syzygy", "xylyls", "jukebox", "quack", "fuzzy", "buzzard", 
    "fizzing", "jazzman", "puzzled", "quacked", "squeeze"
  ],
  expert: [
    "absurd", "banjax", "calque", "djinni", "fjords", 
    "kvasir", "threap", "widdly", "xystus", "yukky", 
    "blowzy", "crypts", "glyphs", "jumped", "quartz"
  ],
  master: [
    "syzygy", "xylyls", "pzazz", "qajaq", "faffy", 
    "jazzbo", "fuzzed", "hajjis", "jujube", "kababs", 
    "buzzed", "fizzle", "jigsaw", "pajama", "quokka"
  ]
};

export default function Wordle() {
  // All existing state and hooks remain exactly the same
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || 'easy';
  const levelNum = parseInt(queryParams.get('level')) || 1;

  const [target, setTarget] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [paused, setPaused] = useState(false);
  const [usedKeys, setUsedKeys] = useState({});
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [width, height] = useWindowSize();

  // All existing functions remain exactly the same
  const pickNewWord = () => {
    const list = wordLists[category];
    const seed = levelNum % list.length;
    const newWord = list[seed].toUpperCase();
    
    setTarget(newWord);
    setGuesses([]);
    setInput("");
    setMsg("");
    setSuccess(false);
    setPaused(false);
    setCountdown(3);
    setShowCountdown(false);
    setUsedKeys({});
  };

  useEffect(() => { pickNewWord(); }, [category, levelNum]);

  const submitGuess = () => {
    if (paused || success) return;

    if (input.length !== target.length) {
      setMsg(`Type a ${target.length}-letter word`);
      return;
    }

    const guess = input.toUpperCase();
    const fb = getFeedback(guess, target);
    const newRows = [...guesses, fb];
    setGuesses(newRows);
    setInput("");

    const updated = { ...usedKeys };
    fb.forEach(({ letter, color }) => {
      const already = updated[letter];
      if (
        color === "green" ||
        (color === "yellow" && already !== "green") ||
        (color === "gray" && !already)
      ) {
        updated[letter] = color;
      }
    });
    setUsedKeys(updated);

    if (guess === target) {
      successSound.play();
      setMsg("🎉 Correct! Level completed!");
      setSuccess(true);
      updateLevelProgress();
      setShowCountdown(true);
      startCountdown();
    } else if (newRows.length === 6) {
      failSound.play();
      setMsg(`❌ Out of attempts! The word was ${target}`);
      setPaused(true);
    }
  };

  const updateLevelProgress = () => {
    const saved = localStorage.getItem('wordleProgress');
    const progress = saved ? JSON.parse(saved) : {
      unlockedCategories: ['easy'],
      completedLevels: {
        easy: 0,
        medium: 0,
        hard: 0,
        expert: 0,
        master: 0
      }
    };
    
    if (levelNum > progress.completedLevels[category]) {
      progress.completedLevels[category] = levelNum;
      localStorage.setItem('wordleProgress', JSON.stringify(progress));
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((p) => {
        if (p === 1) {
          clearInterval(timer);
          navigate('/wordle-levels');
          return 3;
        }
        return p - 1;
      });
    }, 1000);
  };

  const restartLevel = () => {
    restartSound.play();
    pickNewWord();
  };

  const handleKeyPress = (key) => {
    if (input.length < target.length && !paused && !success) {
      setInput(prev => prev + key);
    }
  };

  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  // Only the UI/JSX structure is updated below
  return (
    <div className="wordle-game-page">
      {/* Video Background */}
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="https://ik.imagekit.io/ytissbwn8/12691871_1920_1080_30fps%20(1).mp4?updatedAt=1750657705495" type="video/mp4" />
        </video>
        <div className="overlay"></div>
      </div>
<div className="liquid-background">
  <div className="liquid-shape"></div>
  <div className="overlay"></div>
</div>
      {/* Header */}
      <header className="header">
        <div className="logo">NEUROPLAY</div>
        <nav className="nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/wordle-levels" className="nav-link">Games</a>
          <a href="#benefits" className="nav-link">Benefits</a>
          <a href="#community" className="nav-link">Community</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
      </header>

      <div className="wordle-game-container">
        {/* Confetti Animation */}
        {success && (
          <Confetti
            width={width}
            height={height}
            numberOfPieces={250}
            gravity={0.3}
            colors={["#00f7ff", "#9d00ff", "#ff00e4", "#6e00ff", "#00ffab"]}
          />
        )}

        {/* Game Header */}
        <div className="game-header">
          <div className="level-info-card">
            <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
            <p>Level {levelNum}</p>
            <div className="score-display">
              <FaTrophy className="trophy-icon" />
              <span>Attempts: {guesses.length}/6</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/wordle-levels')} 
            className="back-button"
          >
            <FaArrowLeft /> Levels
          </button>
        </div>

        {/* Game Board */}
        <div className="game-board">
          {guesses.map((row, idx) => (
            <Row key={idx} feedback={row} />
          ))}

          {!success && guesses.length < 6 && (
            <Row feedback={input.toUpperCase().split("").map(l => ({ letter: l }))} />
          )}
        </div>

        {/* Input Area */}
        <div className="input-area">
          <input
            type="text"
            maxLength={target.length}
            value={input}
            onChange={(e) => setInput(e.target.value.toLowerCase())}
            onKeyDown={(e) => e.key === "Enter" && submitGuess()}
            disabled={paused}
            autoFocus
            placeholder={`${target.length}-letter word`}
          />
          <button 
            onClick={submitGuess} 
            disabled={paused || input.length !== target.length}
            className="submit-btn"
          >
            Submit
          </button>
        </div>

        {/* On-Screen Keyboard */}
        {showKeyboard && (
          <div className="keyboard">
            {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, rIdx) => (
              <div className="keyboard-row" key={rIdx}>
                {rIdx === 2 && (
                  <button onClick={submitGuess} className="key enter">Enter</button>
                )}

                {row.split("").map((k) => (
                  <button
                    key={k}
                    className={`key ${usedKeys[k] || ""}`}
                    onClick={() => handleKeyPress(k)}
                  >
                    {k}
                  </button>
                ))}

                {rIdx === 2 && (
                  <button
                    onClick={handleBackspace}
                    className="key backspace"
                  >
                    ⌫
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Game Controls */}
        <div className="game-controls">
          <button
            onClick={() => setShowKeyboard(prev => !prev)}
            className="control-btn"
          >
            <FaKeyboard /> {showKeyboard ? "Hide" : "Show"}
          </button>

          {paused && !success && (
            <button onClick={restartLevel} className="control-btn">
              <FaUndo /> Restart
            </button>
          )}
        </div>

        {/* Status Messages */}
        <div className="game-messages">
          {showCountdown && (
            <p className="countdown">
              ⏳ Returning to levels in {countdown}…
            </p>
          )}
          <p className="status-message">{msg}</p>
        </div>
      </div>
    </div>
  );
}