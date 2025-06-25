import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { ref, set, onValue } from "firebase/database";
import { db, rtdb } from "../firebase";
import Row from "../components/Row";
import { getFeedback } from "../utils/getFeedback";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
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
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="https://ik.imagekit.io/ytissbwn8/12691871_1920_1080_30fps%20(1).mp4?updatedAt=1750657705495" type="video/mp4" />
        </video>
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
        <div className="game-header">
          <div className="challenge-info">
            <h1><FaCalendarAlt /> Daily Challenge</h1>
            <div className="difficulty-badge">
              {dailyWordData.difficulty || "Loading..."}
            </div>
          </div>
          <div className="attempts-display">
            <FaTrophy /> Attempts: {guesses.length}/6
          </div>
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
            <FaKeyboard /> {showKeyboard ? "Hide Keyboard" : "Show Keyboard"}
          </button>

          {paused && !success && (
            <button onClick={restartLevel} className="control-btn">
              <FaUndo /> Restart
            </button>
          )}

          <button 
            onClick={() => navigate('/wordle-levels')} 
            className="control-btn"
          >
            <FaArrowLeft /> Levels
          </button>
        </div>

        {/* Status Messages */}
        <div className="game-messages">
          {showCountdown && (
            <p className="countdown">
              ⏳ Viewing leaderboard in {countdown}…
            </p>
          )}
          <p className="status-message">{msg}</p>
        </div>
      </div>
    </div>
  );
}