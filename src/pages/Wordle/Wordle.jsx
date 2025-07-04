import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getFeedback } from "../../utils/getFeedback";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { FaKeyboard, FaUndo, FaArrowLeft, FaTrophy } from "react-icons/fa";


import './Wordle.css'


const successSound = new Audio("/sounds/success.mp3");
const failSound = new Audio("/sounds/fail.mp3");
const restartSound = new Audio("/sounds/restart.mp3");

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

const WordleRow = ({ letters }) => {
  return (
    <div className="wordle-row">
      {letters.map((letter, index) => (
        <div 
          key={index} 
          className={`wordle-tile ${letter.color || ''}`}
        >
          {letter.letter}
        </div>
      ))}
    </div>
  );
};

export default function Wordle() {
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
  const inputRef = useRef(null);

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

  return (

    <div className="wordle-page">
      <div className="wordle-background">
        <img 
          src="/wordle_level_bg.jpg" 
          alt="Background" 
          className="wordle-bg-image"
        />
        <div className="wordle-overlay"></div>
      </div>

      <header className="wordle-header">
        <div className="wordle-logo">NEUROPLAY</div>
        <nav className="wordle-nav">
          <a href="/" className="wordle-nav-link">Home</a>
          <a href="/wordle-levels" className="wordle-nav-link">Games</a>
          <a href="#benefits" className="wordle-nav-link">Benefits</a>
          <a href="#community" className="wordle-nav-link">Community</a>
          <a href="#contact" className="wordle-nav-link">Contact</a>

        </nav>
      </header>

      <div className="wordle-container">
        {success && (
          <Confetti
            width={width}
            height={height}
            numberOfPieces={250}
            gravity={0.3}
            colors={["#00f7ff", "#9d00ff", "#ff00e4", "#6e00ff", "#00ffab"]}
          />
        )}

        <div className="wordle-header-panel">
          <div className="wordle-level-card">
            <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
            <p>Level {levelNum}</p>
            <div className="wordle-score">
              <FaTrophy className="wordle-trophy" />
              <span>Attempts: {guesses.length}/6</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/wordle-levels')} 
            className="wordle-back-btn"
          >
            <FaArrowLeft /> Levels
          </button>
        </div>

        <div className="wordle-board">
          {guesses.map((row, idx) => (
            <WordleRow key={idx} letters={row} />
          ))}

          {!success && guesses.length < 6 && (
            <div className="wordle-row">
              {Array(target.length).fill('').map((_, index) => (
                <div 
                  key={index} 
                  className={`wordle-tile ${input[index] ? 'wordle-tile-filled' : ''}`}
                >
                  {input[index] || ''}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="wordle-input-area">
          <input
            type="text"
            className="wordle-visible-input"
            maxLength={target.length}
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && submitGuess()}
            disabled={paused}
            autoFocus
            placeholder={`${target.length}-letter word`}
          />
          <button 
            onClick={submitGuess} 
            disabled={paused || input.length !== target.length}
            className="wordle-submit-btn"
          >
            Submit
          </button>
        </div>

        {showKeyboard && (
          
          <div className="wordle-keyboard">
            {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, rIdx) => (
              <div className="wordle-keyboard-row" key={rIdx}>
                {rIdx === 2 && (
                  <button onClick={submitGuess} className="wordle-key wordle-enter">Enter</button>
                )}

                {row.split("").map((k) => (
                  <button
                    key={k}
                    className={`wordle-key ${usedKeys[k] || ""}`}
                    onClick={() => handleKeyPress(k)}
                  >
                    {k}
                  </button>
                ))}

                {rIdx === 2 && (
                  <button
                    onClick={handleBackspace}
                    className="wordle-key wordle-backspace"
                  >
                    ⌫
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="wordle-controls">
          <button
            onClick={() => setShowKeyboard(prev => !prev)}
            className="wordle-control-btn"
          >
            <FaKeyboard /> {showKeyboard ? "Hide" : "Show"} Keyboard
          </button>

          {paused && !success && (
            <button onClick={restartLevel} className="wordle-control-btn">
              <FaUndo /> Restart
            </button>
          )}
        </div>

        <div className="wordle-messages">
          {showCountdown && (
            <p className="wordle-countdown">
              ⏳ Returning to levels in {countdown}…
            </p>
          )}
          <p className="wordle-status">{msg}</p>
        </div>
      </div>
    </div>
  );
}