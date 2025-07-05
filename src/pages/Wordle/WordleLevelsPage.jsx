import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaTrophy, FaStar, FaBrain, FaCalendarAlt } from 'react-icons/fa';
import './WordleLevelsPage.css';

const WordleLevelsPage = () => {
  const navigate = useNavigate();
  
  // Load saved progress from localStorage or initialize
  const [unlockedCategories, setUnlockedCategories] = useState(() => {
    const saved = localStorage.getItem('wordleProgress');
    return saved ? JSON.parse(saved).unlockedCategories : ['easy'];
  });
  
  const [completedLevels, setCompletedLevels] = useState(() => {
    const saved = localStorage.getItem('wordleProgress');
    return saved ? JSON.parse(saved).completedLevels : {
      easy: 0,
      medium: 0,
      hard: 0,
      expert: 0,
      master: 0
    };
  });

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState('');

  const categories = [
    { id: 'easy', name: 'Easy', color: '#00f7ff', levels: 50, unlockThreshold: 25 },
    { id: 'medium', name: 'Medium', color: '#9d00ff', levels: 50, unlockThreshold: 25 },
    { id: 'hard', name: 'Hard', color: '#ff00e4', levels: 50, unlockThreshold: 25 },
    { id: 'expert', name: 'Expert', color: '#6e00ff', levels: 50, unlockThreshold: 25 },
    { id: 'master', name: 'Master', color: '#00ffab', levels: 50, unlockThreshold: 25 }
  ];

  // Calculate time until midnight
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Check category unlock status
  const isCategoryUnlocked = (categoryId) => {
    return unlockedCategories.includes(categoryId);
  };

  // Check if category can be unlocked
  useEffect(() => {
    const newUnlocked = [...unlockedCategories];
    let changed = false;

    categories.forEach(cat => {
      if (!unlockedCategories.includes(cat.id)) {
        const prevCat = categories[categories.findIndex(c => c.id === cat.id) - 1];
        if (prevCat && completedLevels[prevCat.id] >= cat.unlockThreshold) {
          newUnlocked.push(cat.id);
          changed = true;
        }
      }
    });

    if (changed) {
      setUnlockedCategories(newUnlocked);
      // Save to localStorage
      const progress = {
        unlockedCategories: newUnlocked,
        completedLevels
      };
      localStorage.setItem('wordleProgress', JSON.stringify(progress));
    }
  }, [completedLevels]);

  const handleLevelClick = (categoryId, levelNum) => {
    navigate(`/wordle?category=${categoryId}&level=${levelNum}`);
  };

  return (
    <div className="wordle-levels-page">
      {/* Video Background */}
      <div className="video-background">
         <img 
    src="/wordle_level_bg.jpg" 
    alt="Background" 
    className="background-image"
  />
        <div className="overlay"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo">NEUROPLAY</div>
        <nav className="nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/Games" className="nav-link">Games</a>
    
        </nav>
      </header>

      <div className="wordle-levels-container">
        {/* Daily Challenge Banner */}
        <div 
          className="daily-challenge-banner animate-on-scroll"
          onClick={() => navigate('/daily-wordle')}
        >
          <div className="daily-content">
            <FaCalendarAlt size={24} />
            <div>
              <h3>Daily Challenge</h3>
              <p>Play today's special word! Resets in {timeLeft || 'calculating...'}</p>
            </div>
          </div>
          <button className="daily-play-button">
            PLAY NOW
          </button>
        </div>

        <h1 className="page-title animate-on-scroll"><FaBrain /> WORDLE BRAIN BOOST</h1>
        
        {/* Progress Overview */}
        <div className="progress-tracker animate-on-scroll">
          {categories.map(cat => (
            <div key={cat.id} className="progress-item">
              <span className="progress-label">{cat.name}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${(completedLevels[cat.id] / cat.levels) * 100}%`,
                    backgroundColor: cat.color
                  }}
                ></div>
              </div>
              <span className="progress-count">
                {completedLevels[cat.id]}/{cat.levels}
              </span>
            </div>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.map(category => (
            <div 
              key={category.id}
              className={`category-card animate-on-scroll ${isCategoryUnlocked(category.id) ? '' : 'locked'}`}
              style={{ borderColor: category.color }}
            >
              {!isCategoryUnlocked(category.id) && (
                <div className="lock-overlay">
                  <FaLock size={40} />
                  <p>Complete {category.unlockThreshold} {
                    categories[categories.findIndex(c => c.id === category.id) - 1]?.name
                  } levels</p>
                </div>
              )}

              <h2 style={{ color: category.color }}>
                {category.name} {isCategoryUnlocked(category.id) && ''}
              </h2>
              
              <div className="levels-grid">
                {[...Array(category.levels)].map((_, i) => (
                  <div
                    key={i}
                    className={`level-dot ${i < completedLevels[category.id] ? 'completed' : ''}`}
                    style={{
                      backgroundColor: i < completedLevels[category.id] ? category.color : '#333',
                      cursor: isCategoryUnlocked(category.id) ? 'pointer' : 'default'
                    }}
                    onClick={() => isCategoryUnlocked(category.id) && handleLevelClick(category.id, i + 1)}
                  >
                    {i < completedLevels[category.id] && <FaStar size={10} color="#FFD700" />}
                  </div>
                ))}
              </div>

              {isCategoryUnlocked(category.id) && (
                <button 
                  className="play-button"
                  style={{ backgroundColor: category.color }}
                  onClick={() => handleLevelClick(category.id, Math.min(completedLevels[category.id] + 1, category.levels))}
                >
                  {completedLevels[category.id] >= category.levels ? 'REPLAY' : 'PLAY NEXT'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Floating Daily Challenge Button */}
        <div 
          className="floating-daily-btn"
          onClick={() => navigate('/daily-wordle')}
          title="Daily Challenge"
        >
          <FaCalendarAlt />
        </div>
      </div>
    </div>
  );
};

export default WordleLevelsPage;