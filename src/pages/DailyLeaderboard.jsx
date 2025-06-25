import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase";
import { FaTrophy, FaArrowLeft, FaCrown } from "react-icons/fa";

export default function DailyLeaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [today, setToday] = useState("");

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    setToday(todayDate);
    
    const leaderboardRef = ref(rtdb, `leaderboard/${todayDate}`);
    
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

  return (
    <div className="leaderboard-page">
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

      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1><FaTrophy /> Daily Leaderboard</h1>
          <p className="leaderboard-date">{new Date(today).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>

        <div className="leaderboard-content">
          {leaderboard.length > 0 ? (
            <div className="leaderboard-grid">
              <div className="leaderboard-header-row">
                <div>Rank</div>
                <div>Player</div>
                <div>Attempts</div>
                <div>Time</div>
              </div>
              {leaderboard.map(([userId, data], index) => (
                <div 
                  key={userId} 
                  className={`leaderboard-row ${index === 0 ? "first-place" : ""}`}
                >
                  <div className="rank">
                    {index === 0 ? <FaCrown className="crown-icon" /> : index + 1}
                  </div>
                  <div className="player">{userId.substring(0, 5)}...</div>
                  <div className="attempts">{data.attempts}</div>
                  <div className="time">{data.time}s</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-leaderboard">
              <p>No scores yet for today!</p>
              <p>Be the first to complete today's challenge!</p>
            </div>
          )}
        </div>

        <div className="leaderboard-actions">
          <button 
            onClick={() => navigate('/daily-wordle')} 
            className="action-btn"
          >
            <FaArrowLeft /> Play Today's Challenge
          </button>
          <button 
            onClick={() => navigate('/wordle-levels')} 
            className="action-btn"
          >
            <FaArrowLeft /> Back to Levels
          </button>
        </div>
      </div>
    </div>
  );
}