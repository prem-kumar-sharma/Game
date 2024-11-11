import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [name, setName] = useState('');
  const [inputMode, setInputMode] = useState('voice');
  const [voiceType, setVoiceType] = useState('1');
  const [gameMode, setGameMode] = useState('classic'); // 'classic' or 'story'
  const navigate = useNavigate();

  const startGame = () => {
    if (!name) {
      alert('Please enter your name');
      return;
    }

    // Navigate based on game mode
    if (gameMode === 'story') {
      navigate('/story', { 
        state: { 
          name, 
          inputMode, 
          voiceType,
          currentLevel: 1,
          unlockedLevels: 1
        } 
      });
    } else {
      // Classic mode - original game
      navigate('/play', { 
        state: { 
          name, 
          inputMode, 
          voiceType 
        } 
      });
    }
  };

  return (
    <div className="home">
      <div className="magical-overlay">
        <div className="content">
          <h1 className="magical-title">Voice Wordle</h1>
          <p className="story-intro">
            {gameMode === 'story' 
              ? "Enter a magical realm where words hold the power to break the silence. Help restore voices to the inhabitants of this enchanted world."
              : "Challenge yourself with the classic word-guessing game, powered by your voice!"}
          </p>

          <div className="name-input-container">
            <input
              type="text"
              placeholder="Enter your name, brave player"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="magical-input"
            />
          </div>

          <div className="game-mode-selection">
            <h2>Choose Your Path</h2>
            <div className="mode-buttons">
              <button
                className={`mode-button ${gameMode === 'classic' ? 'selected' : ''}`}
                onClick={() => setGameMode('classic')}
              >
                <span className="mode-icon">🎮</span>
                <div className="mode-details">
                  <h3>Classic Mode</h3>
                  <p>Original word-guessing challenge</p>
                </div>
              </button>

              <button
                className={`mode-button ${gameMode === 'story' ? 'selected' : ''}`}
                onClick={() => setGameMode('story')}
              >
                <span className="mode-icon">📖</span>
                <div className="mode-details">
                  <h3>Story Mode</h3>
                  <p>Embark on a magical adventure</p>
                </div>
              </button>
            </div>
          </div>

          <div className="input-mode-selection">
            <h2>Choose Your Input Method</h2>
            <div className="input-options">
              <label className={`input-option ${inputMode === 'voice' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="voice"
                  checked={inputMode === 'voice'}
                  onChange={() => setInputMode('voice')}
                />
                <span className="option-icon">🗣️</span>
                <span>{gameMode === 'story' ? 'Voice Magic' : 'Voice Input'}</span>
              </label>
              <label className={`input-option ${inputMode === 'typing' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="typing"
                  checked={inputMode === 'typing'}
                  onChange={() => setInputMode('typing')}
                />
                <span className="option-icon">⌨️</span>
                <span>{gameMode === 'story' ? 'Scroll Magic' : 'Typing Input'}</span>
              </label>
            </div>
          </div>

          {inputMode === 'voice' && (
            <div className="voice-selection">
              <h2>{gameMode === 'story' ? 'Choose Your Voice Crystal' : 'Select Voice Type'}</h2>
              <div className="voice-options">
                <label className={`voice-option ${voiceType === '1' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    value="1"
                    checked={voiceType === '1'}
                    onChange={() => setVoiceType('1')}
                  />
                  <span className="crystal-icon">{gameMode === 'story' ? '💎' : '🎤'}</span>
                  <span>{gameMode === 'story' ? 'Crystal Echo' : 'Voice Type 1'}</span>
                </label>
                <label className={`voice-option ${voiceType === '2' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    value="2"
                    checked={voiceType === '2'}
                    onChange={() => setVoiceType('2')}
                  />
                  <span className="crystal-icon">{gameMode === 'story' ? '🔮' : '🎙️'}</span>
                  <span>{gameMode === 'story' ? 'Mystic Whisper' : 'Voice Type 2'}</span>
                </label>
                <label className={`voice-option ${voiceType === '3' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    value="3"
                    checked={voiceType === '3'}
                    onChange={() => setVoiceType('3')}
                  />
                  <span className="crystal-icon">{gameMode === 'story' ? '✨' : '🔊'}</span>
                  <span>{gameMode === 'story' ? 'Star Song' : 'Voice Type 3'}</span>
                </label>
              </div>
            </div>
          )}

          <button 
            className="start-button" 
            onClick={startGame}
          >
            {gameMode === 'story' ? 'Begin Your Journey' : 'Start Game'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;