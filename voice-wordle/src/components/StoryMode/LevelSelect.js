import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LevelSelect.css';

const LevelSelect = ({ currentLevel, unlockedLevels, onLevelSelect }) => {
  const navigate = useNavigate();
  
  // Level data with themes and characters
  const levels = [
    { id: 1, name: "Forest Whispers", character: "Lost Songbird", difficulty: "Easy" },
    { id: 2, name: "Crystal Caverns", character: "Echo Miner", difficulty: "Easy" },
    { id: 3, name: "Mystic Gardens", character: "Silent Sage", difficulty: "Medium" },
    { id: 4, name: "Ancient Library", character: "Wordkeeper", difficulty: "Medium" },
    { id: 5, name: "Cloud Kingdom", character: "Sky Singer", difficulty: "Hard" },
    { id: 6, name: "Dragon's Lair", character: "Dragon Elder", difficulty: "Hard" },
    { id: 7, name: "Starlight Tower", character: "Star Weaver", difficulty: "Expert" },
    { id: 8, name: "Queen's Castle", character: "Queen Murmura", difficulty: "Final" },
  ];

  const handleLevelClick = (levelId) => {
    if (levelId <= unlockedLevels) {
      onLevelSelect(levelId);
    } else {
      // Play locked level sound/animation
      const audio = new Audio('/sounds/locked.mp3'); // Add appropriate sound
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  return (
    <div className="level-select-container">
      <div className="level-map">
        <h1 className="magical-title">Whisper World</h1>
        
        <div className="floating-islands">
          {levels.map((level) => (
            <div
              key={level.id}
              className={`level-island ${level.id === currentLevel ? 'current' : ''} 
                         ${level.id <= unlockedLevels ? 'unlocked' : 'locked'}`}
              onClick={() => handleLevelClick(level.id)}
            >
              <div className="island-content">
                <div className="level-number">{level.id}</div>
                <h3 className="level-name">{level.name}</h3>
                <div className="level-character">{level.character}</div>
                <div className="difficulty-badge">{level.difficulty}</div>
                
                {level.id <= unlockedLevels ? (
                  <div className="magical-glow"></div>
                ) : (
                  <div className="lock-icon">🔒</div>
                )}
              </div>

              {level.id < levels.length && (
                <div className={`path-to-next ${level.id < unlockedLevels ? 'unlocked' : ''}`}>
                  <div className="path-line"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="level-info">
          <div className="player-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(unlockedLevels / levels.length) * 100}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {unlockedLevels} / {levels.length} Areas Unlocked
            </div>
          </div>
        </div>

        <button 
          className="return-button"
          onClick={() => navigate('/')}
        >
          Return to Portal
        </button>
      </div>
    </div>
  );
};

export default LevelSelect;