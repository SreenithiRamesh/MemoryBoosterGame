import React, { useState } from 'react';
import './ChessInstruction.css'; // Import the CSS file

const ChessInstructions = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    difficulty: 'medium',
    timeControl: '10+0',
    soundEnabled: true,
    animationsEnabled: true,
    theme: 'dark'
  });

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStartPlaying = () => {
    console.log('Starting game with settings:', settings);
    // Add your game start logic here
  };

  const instructionCards = [
    {
      icon: '♔',
      title: 'Game Objective',
      text: 'The goal is to checkmate your opponent\'s king by placing it under attack with no escape route available.'
    },
    {
      icon: '⚔️',
      title: 'Basic Movement',
      text: 'Each piece has unique movement patterns. Learn how each piece moves to develop your strategy.'
    },
    {
      icon: '🏰',
      title: 'Special Moves',
      text: 'Master special moves like castling, en passant, and pawn promotion to gain tactical advantages.'
    },
    {
      icon: '🎯',
      title: 'Strategy & Tactics',
      text: 'Develop your opening, middle game, and endgame skills to become a formidable chess player.'
    }
  ];

  const chessPieces = [
    {
      icon: '♔',
      name: 'King',
      description: 'Moves one square in any direction. Must be protected at all costs.'
    },
    {
      icon: '♕',
      name: 'Queen',
      description: 'Most powerful piece. Moves any number of squares horizontally, vertically, or diagonally.'
    },
    {
      icon: '♖',
      name: 'Rook',
      description: 'Moves any number of squares horizontally or vertically.'
    },
    {
      icon: '♗',
      name: 'Bishop',
      description: 'Moves any number of squares diagonally.'
    },
    {
      icon: '♘',
      name: 'Knight',
      description: 'Moves in an L-shape: 2 squares in one direction, 1 in perpendicular.'
    },
    {
      icon: '♙',
      name: 'Pawn',
      description: 'Moves forward one square, captures diagonally. Can promote when reaching the end.'
    }
  ];

  return (
    <div className="chessinstructioncontainer">
      {/* Header */}
      <header className="chessinstructionheader">
        <div className="chessinstructionlogo">
          ♔ Chess Master
        </div>
        <button 
          className="chessinstructionsettingsbtn"
          onClick={handleSettingsClick}
        >
          <svg className="chessinstructionsettingsicon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
          </svg>
          Settings
        </button>
      </header>

      {/* Settings Modal */}
      <div className={`chessinstructionsettingsmodal ${showSettings ? 'show' : ''}`}>
        <div className="chessinstructionsettingscontent">
          <div className="chessinstructionsettingsheader">
            <h2 className="chessinstructionsettingstitle">Game Settings</h2>
            <button className="chessinstructionsettingsclose" onClick={handleCloseSettings}>
              ×
            </button>
          </div>
          
          <div className="chessinstructionsettingsgroup">
            <label className="chessinstructionsettingslabel">Difficulty Level</label>
            <select 
              className="chessinstructionsettingsselect"
              value={settings.difficulty}
              onChange={(e) => handleSettingChange('difficulty', e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="chessinstructionsettingsgroup">
            <label className="chessinstructionsettingslabel">Time Control</label>
            <select 
              className="chessinstructionsettingsselect"
              value={settings.timeControl}
              onChange={(e) => handleSettingChange('timeControl', e.target.value)}
            >
              <option value="1+0">1 minute</option>
              <option value="3+0">3 minutes</option>
              <option value="5+0">5 minutes</option>
              <option value="10+0">10 minutes</option>
              <option value="15+10">15 + 10 seconds</option>
              <option value="30+0">30 minutes</option>
            </select>
          </div>

          <div className="chessinstructionsettingsgroup">
            <label className="chessinstructionsettingslabel">Theme</label>
            <select 
              className="chessinstructionsettingsselect"
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
            </select>
          </div>

          <div className="chessinstructionsettingsgroup">
            <div className="chessinstructionsettingscheckbox">
              <input 
                type="checkbox" 
                id="soundEnabled"
                checked={settings.soundEnabled}
                onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
              />
              <label htmlFor="soundEnabled">Enable Sound Effects</label>
            </div>
          </div>

          <div className="chessinstructionsettingsgroup">
            <div className="chessinstructionsettingscheckbox">
              <input 
                type="checkbox" 
                id="animationsEnabled"
                checked={settings.animationsEnabled}
                onChange={(e) => handleSettingChange('animationsEnabled', e.target.checked)}
              />
              <label htmlFor="animationsEnabled">Enable Animations</label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="chessinstructionmaincontent">
        <h1 className="chessinstructiontitle">Learn Chess</h1>
        <p className="chessinstructionsubtitle">
          Master the royal game with our comprehensive guide
        </p>

        {/* Instructions Grid */}
        <div className="chessinstructionsgrid">
          {instructionCards.map((card, index) => (
            <div key={index} className="chessinstructioncard">
              <div className="chessinstructioncardicon">
                {card.icon}
              </div>
              <h3 className="chessinstructioncardtitle">{card.title}</h3>
              <p className="chessinstructioncardtext">{card.text}</p>
            </div>
          ))}
        </div>

        {/* Chess Pieces Section */}
        <div className="chessinstructionpiecescontainer">
          <h2 className="chessinstructionpiecestitle">Chess Pieces</h2>
          <div className="chessinstructionpiecesgrid">
            {chessPieces.map((piece, index) => (
              <div key={index} className="chessinstructionpiece">
                <span className="chessinstructionpieceicon">{piece.icon}</span>
                <h4 className="chessinstructionpiecename">{piece.name}</h4>
                <p className="chessinstructionpiecedesc">{piece.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="chessinstructionactions">
          <button 
            className="chessinstructionplaybtn"
            onClick={handleStartPlaying}
          >
            Start Playing
          </button>
        </div>
      </main>
    </div>
  );
};



export default ChessInstructions;