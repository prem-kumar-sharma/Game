import React from 'react';
import './StoryProgress.css';

const StoryProgress = ({ 
  unlockedLevels, 
  totalLevels, 
  freedCharacters, 
  currentLevel,
  onCharacterClick 
}) => {
  const calculateProgress = () => {
    return Math.floor((unlockedLevels / totalLevels) * 100);
  };

  const renderStars = (level) => {
    const stars = freedCharacters[level] || 0;
    return (
      <div className="level-stars">
        {[1, 2, 3].map((star) => (
          <span 
            key={star} 
            className={`star ${star <= stars ? 'earned' : ''}`}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="story-progress">
      <div className="progress-header">
        <h2>Journey Progress</h2>
        <div className="progress-percentage">{calculateProgress()}%</div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${calculateProgress()}%` }}
        >
          <div className="magical-sparkles"></div>
        </div>
      </div>

      <div className="freed-characters">
        <h3>Freed Voices</h3>
        <div className="character-grid">
          {Object.entries(freedCharacters).map(([level, stars], index) => (
            <div 
              key={level}
              className={`character-card ${currentLevel === Number(level) ? 'current' : ''}`}
              onClick={() => onCharacterClick(Number(level))}
            >
              <div className="character-icon">👤</div>
              <div className="character-info">
                <div className="character-name">
                  Level {level} Character
                </div>
                {renderStars(level)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="journey-stats">
        <div className="stat-item">
          <div className="stat-label">Levels Unlocked</div>
          <div className="stat-value">{unlockedLevels}/{totalLevels}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Voices Freed</div>
          <div className="stat-value">
            {Object.keys(freedCharacters).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryProgress;