import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { ref, set, onValue } from "firebase/database";
import { db, rtdb } from "../../firebase";
import { getFeedback } from "../../utils/getFeedback";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import "./DailyWordle.css";
import { FaKeyboard, FaUndo, FaArrowLeft, FaTrophy, FaCalendarAlt } from "react-icons/fa";

// Sound Effects
const successSound = new Audio("/sounds/success.mp3");
const failSound = new Audio("/sounds/fail.mp3");
const restartSound = new Audio("/sounds/restart.mp3");

export default function DailyWordle() {
  const navigate = useNavigate();
  const [width, height] = useWindowSize();

  /* ───────── Core State ───────── */
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
  const [leaderboard, setLeaderboard] = useState([]);
  const [dailyWordData, setDailyWordData] = useState({ word: "", difficulty: "" });

  /* ───────── Fetch Daily Word ───────── */
  useEffect(() => {
    const fetchDailyWord = async () => {
      const today = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "daily_challenges", today);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTarget(data.word.toUpperCase());
        setDailyWordData({
          word: data.word,
          difficulty: data.difficulty
        });
      } else {
        alert("No daily word set for today!");
        navigate("/wordle-levels");
      }
    };

    fetchDailyWord();
  }, [navigate]);

  /* ───────── Leaderboard Setup ───────── */
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const leaderboardRef = ref(rtdb, `leaderboard/${today}`);

    onValue(leaderboardRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sorted = Object.entries(data)
          .sort((a, b) => a[1].attempts - b[1].attempts || a[1].time - b[1].time)
          .slice(0, 10);
        setLeaderboard(sorted);
      }
    });
  }, []);

  /* ───────── Game Logic ───────── */
  const submitGuess = () => {
    if (paused || success) return;

    if (input.length !== target.length) {
      setMsg(`Type a ${target.length}-letter word`);
      // Add shake animation
      const rows = document.querySelectorAll('.daily-wordle-row');
      if (rows[guesses.length]) {
        rows[guesses.length].classList.add('invalid');
        setTimeout(() => {
          rows[guesses.length].classList.remove('invalid');
        }, 500);
      }
      return;
    }

    const guess = input.toUpperCase();
    const fb = getFeedback(guess, target);
    const newRows = [...guesses, fb];
    setGuesses(newRows);
    setInput("");

    // Update used keys
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

    // Win/Lose check
    if (guess === target) {
      successSound.play();
      setMsg("🎉 Correct! Daily challenge completed!");
      setSuccess(true);
      submitScore(newRows.length, Math.floor((Date.now() - gameStartTime) / 1000));
      setShowCountdown(true);
      startCountdown();
    } else if (newRows.length === 6) {
      failSound.play();
      setMsg(`❌ Out of attempts! The word was ${target}`);
      setPaused(true);
    }
  };

  const [gameStartTime] = useState(Date.now());

  const submitScore = (attempts, timeInSeconds) => {
    const today = new Date().toISOString().split("T")[0];
    const userId = "guest_" + Math.random().toString(36).substring(2, 9);
    const scoreRef = ref(rtdb, `leaderboard/${today}/${userId}`);

    set(scoreRef, {
      attempts,
      time: timeInSeconds,
      timestamp: Date.now(),
      difficulty: dailyWordData.difficulty
    });
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((p) => {
        if (p === 1) {
          clearInterval(timer);
          navigate('/daily-leaderboard');
          return 3;
        }
        return p - 1;
      });
    }, 1000);
  };

  const restartLevel = () => {
    restartSound.play();
    setGuesses([]);
    setInput("");
    setMsg("");
    setSuccess(false);
    setPaused(false);
    setUsedKeys({});
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
    <div className="daily-wordle-page">
      {/* Video Background */}
      <div className="daily-wordle-video-background">
        <img 
          src="/wordle_level_bg.jpg" 
          alt="Background" 
          className="background-image"
        />
        <div className="daily-wordle-overlay"></div>
      </div>

      {/* Header */}
      <header className="daily-wordle-header">
        <div className="daily-wordle-logo">NEUROPLAY</div>
        <nav className="daily-wordle-nav">
          <a href="/" className="daily-wordle-nav-link">Home</a>
          <a href="/wordle-levels" className="daily-wordle-nav-link">Games</a>
          <a href="#benefits" className="daily-wordle-nav-link">Benefits</a>
          <a href="#community" className="daily-wordle-nav-link">Community</a>
          <a href="#contact" className="daily-wordle-nav-link">Contact</a>
        </nav>
      </header>

      <div className="daily-wordle-container">
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
        <div className="daily-wordle-game-header">
          <div className="daily-wordle-challenge-info">
            <h1><FaCalendarAlt /> Daily Challenge</h1>
            <div className="daily-wordle-difficulty-badge">
              {dailyWordData.difficulty || "Loading..."}
            </div>
          </div>
          <div className="daily-wordle-attempts-display">
            <FaTrophy /> Attempts: {guesses.length}/6
          </div>
        </div>

        {/* Game Board */}
        <div className="daily-wordle-game-board">
          {guesses.map((row, idx) => (
            <div className="daily-wordle-row" key={idx}>
              {row.map(({ letter, color }, i) => (
                <div 
                  key={i} 
                  className={`daily-wordle-tile daily-wordle-tile-filled daily-wordle-tile-${color}`}
                  style={{ '--tile-index': i }}
                >
                  {letter}
                </div>
              ))}
            </div>
          ))}

          {!success && guesses.length < 6 && (
            <div className="daily-wordle-row">
              {Array(target.length).fill('').map((_, index) => (
                <div 
                  key={index} 
                  className={`daily-wordle-tile ${input[index] ? 'daily-wordle-tile-filled' : ''}`}
                >
                  {input[index] || ''}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="daily-wordle-input-area">
          <input
            type="text"
            className="daily-wordle-visible-input"
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
            className="daily-wordle-submit-btn"
          >
            Submit
          </button>
        </div>

        {/* On-Screen Keyboard */}
       {showKeyboard && (
  <div className="daily-wordle-keyboard-container">
    <div className="daily-wordle-keyboard">
      {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, rIdx) => (
        <div className="daily-wordle-keyboard-row" key={rIdx}>
          {rIdx === 2 && (
            <button 
              onClick={submitGuess} 
              className="daily-wordle-key daily-wordle-key-enter"
            >
              Enter
            </button>
          )}

          {row.split("").map((k) => (
            <button
              key={k}
              className={`daily-wordle-key ${usedKeys[k] ? `daily-wordle-key-${usedKeys[k]}` : ""}`}
              onClick={() => handleKeyPress(k)}
            >
              {k}
            </button>
          ))}

          {rIdx === 2 && (
            <button
              onClick={handleBackspace}
              className="daily-wordle-key daily-wordle-key-backspace"
            >
              ⌫
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
)}

        {/* Game Controls */}
        <div className="daily-wordle-game-controls">
          <button
            onClick={() => setShowKeyboard(prev => !prev)}
            className="daily-wordle-control-btn"
          >
            <FaKeyboard /> {showKeyboard ? "Hide Keyboard" : "Show Keyboard"}
          </button>

          {paused && !success && (
            <button onClick={restartLevel} className="daily-wordle-control-btn">
              <FaUndo /> Restart
            </button>
          )}

          <button 
            onClick={() => navigate('/wordle-levels')} 
            className="daily-wordle-control-btn"
          >
            <FaArrowLeft /> Levels
          </button>
        </div>

        {/* Status Messages */}
        <div className="daily-wordle-game-messages">
          {showCountdown && (
            <p className="daily-wordle-countdown">
              ⏳ Viewing leaderboard in {countdown}…
            </p>
          )}
          <p className="daily-wordle-status-message">{msg}</p>
        </div>
      </div>
    </div>
  );
}