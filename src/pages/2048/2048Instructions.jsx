import React, { useState } from 'react';
import './2048Instructions.css'; // Import the CSS file

const Game2048Instructions = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    gridSize: '4x4',
    goalTile: '2048',
    animationSpeed: 'medium',
    soundEnabled: true,
    showHints: true,
    autoSave: true,
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
    console.log('Starting 2048 game with settings:', settings);
    // Add your game start logic here
  };

  const instructionCards = [
    {
      icon: '🎯',
      title: 'Game Objective',
      text: 'Slide numbered tiles on a grid to combine them and create a tile with the number 2048. Keep playing to achieve even higher scores!'
    },
    {
      icon: '⬅️',
      title: 'How to Move',
      text: 'Use arrow keys or swipe gestures to move tiles. When two tiles with the same number touch, they merge into one tile with double the value.'
    },
    {
      icon: '🔢',
      title: 'Tile Values',
      text: 'Start with 2 and 4 tiles. Combine identical tiles to create 8, 16, 32, 64, 128, 256, 512, 1024, and finally 2048!'
    },
    {
      icon: '🏆',
      title: 'Winning Strategy',
      text: 'Keep your highest tile in a corner and build around it. Plan your moves carefully to avoid filling up the grid completely.'
    }
  ];

  const gameControls = [
    {
      key: '↑',
      action: 'Move Up',
      description: 'All tiles slide upward'
    },
    {
      key: '↓',
      action: 'Move Down',
      description: 'All tiles slide downward'
    },
    {
      key: '←',
      action: 'Move Left',
      description: 'All tiles slide left'
    },
    {
      key: '→',
      action: 'Move Right',
      description: 'All tiles slide right'
    }
  ];

  const demoBoard = [
    [null, 2, null, null],
    [null, null, 4, null],
    [2, null, null, 8],
    [null, null, null, 16]
  ];

  return (
    <div className="i2048instructioncontainer">
      {/* Header */}
      <header className="i2048instructionheader">
        <div className="i2048instructionlogo">
          2048
        </div>
        <button 
          className="i2048instructionsettingsbtn"
          onClick={handleSettingsClick}
        >
          <svg className="i2048instructionsettingsicon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
          </svg>
          Settings
        </button>
      </header>

      {/* Settings Modal */}
      <div className={`i2048instructionsettingsmodal ${showSettings ? 'show' : ''}`}>
        <div className="i2048instructionsettingscontent">
          <div className="i2048instructionsettingsheader">
            <h2 className="i2048instructionsettingstitle">Game Settings</h2>
            <button className="i2048instructionsettingsclose" onClick={handleCloseSettings}>
              ×
            </button>
          </div>
          
          <div className="i2048instructionsettingsgroup">
            <label className="i2048instructionsettingslabel">Grid Size</label>
            <select 
              className="i2048instructionsettingsselect"
              value={settings.gridSize}
              onChange={(e) => handleSettingChange('gridSize', e.target.value)}
            >
              <option value="3x3">3x3 (Easy)</option>
              <option value="4x4">4x4 (Classic)</option>
              <option value="5x5">5x5 (Hard)</option>
              <option value="6x6">6x6 (Expert)</option>
            </select>
          </div>

          <div className="i2048instructionsettingsgroup">
            <label className="i2048instructionsettingslabel">Goal Tile</label>
            <select 
              className="i2048instructionsettingsselect"
              value={settings.goalTile}
              onChange={(e) => handleSettingChange('goalTile', e.target.value)}
            >
              <option value="1024">1024</option>
              <option value="2048">2048</option>
              <option value="4096">4096</option>
              <option value="8192">8192</option>
            </select>
          </div>

          <div className="i2048instructionsettingsgroup">
            <label className="i2048instructionsettingslabel">Animation Speed</label>
            <select 
              className="i2048instructionsettingsselect"
              value={settings.animationSpeed}
              onChange={(e) => handleSettingChange('animationSpeed', e.target.value)}
            >
              <option value="slow">Slow</option>
              <option value="medium">Medium</option>
              <option value="fast">Fast</option>
              <option value="instant">Instant</option>
            </select>
          </div>

          <div className="i2048instructionsettingsgroup">
            <label className="i2048instructionsettingslabel">Theme</label>
            <select 
              className="i2048instructionsettingsselect"
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="neon">Neon</option>
              <option value="classic">Classic</option>
            </select>
          </div>

          <div className="i2048instructionsettingsgroup">
            <div className="i2048instructionsettingscheckbox">
              <input 
                type="checkbox" 
                id="soundEnabled"
                checked={settings.soundEnabled}
                onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
              />
              <label htmlFor="soundEnabled">Enable Sound Effects</label>
            </div>
          </div>

          <div className="i2048instructionsettingsgroup">
            <div className="i2048instructionsettingscheckbox">
              <input 
                type="checkbox" 
                id="showHints"
                checked={settings.showHints}
                onChange={(e) => handleSettingChange('showHints', e.target.checked)}
              />
              <label htmlFor="showHints">Show Hints</label>
            </div>
          </div>

          <div className="i2048instructionsettingsgroup">
            <div className="i2048instructionsettingscheckbox">
              <input 
                type="checkbox" 
                id="autoSave"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              />
              <label htmlFor="autoSave">Auto Save Progress</label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="i2048instructionmaincontent">
        <h1 className="i2048instructiontitle">Learn 2048</h1>
        <p className="i2048instructionsubtitle">
          Master the addictive number puzzle game
        </p>

        {/* Instructions Grid */}
        <div className="i2048instructionsgrid">
          {instructionCards.map((card, index) => (
            <div key={index} className="i2048instructioncard">
              <div className="i2048instructioncardicon">
                {card.icon}
              </div>
              <h3 className="i2048instructioncardtitle">{card.title}</h3>
              <p className="i2048instructioncardtext">{card.text}</p>
            </div>
          ))}
        </div>

        {/* Game Board Demo */}
        <div className="i2048instructionboardcontainer">
          <h2 className="i2048instructionboardtitle">Game Board</h2>
          <div className="i2048instructionboard">
            {demoBoard.flat().map((value, index) => (
              <div 
                key={index} 
                className={`i2048instructiontile ${value ? 'filled' : ''} ${value ? `tile-${value}` : ''}`}
              >
                {value || ''}
              </div>
            ))}
          </div>
        </div>

        {/* Controls Section */}
        <div className="i2048instructioncontrolscontainer">
          <h2 className="i2048instructioncontrolstitle">Game Controls</h2>
          <div className="i2048instructioncontrolsgrid">
            {gameControls.map((control, index) => (
              <div key={index} className="i2048instructioncontrol">
                <span className="i2048instructioncontrolkey">{control.key}</span>
                <div className="i2048instructioncontrolaction">{control.action}</div>
                <div className="i2048instructioncontroldesc">{control.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="i2048instructionactions">
          <button 
            className="i2048instructionplaybtn"
            onClick={handleStartPlaying}
          >
            START PLAYING
          </button>
        </div>
      </main>
    </div>
  );
};

export default Game2048Instructions;