import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [name, setName] = useState('');
  const [inputMode, setInputMode] = useState('voice');
  const [voiceType, setVoiceType] = useState('1');
  const navigate = useNavigate();

  const startGame = () => {
    if (name) {
      navigate('/play', { state: { name, inputMode, voiceType } });
    } else {
      alert('Please enter your name');
    }
  };

  return (
    <div className="home">
      <div className="overlay">
        <div className="content">
          <h1 className="title">Welcome to Voice Wordle</h1>
          <p className="description">Test your word-guessing skills with voice commands!</p>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="input-mode-selection">
            <p>Select Input Mode:</p>
            <label>
              <input
                type="radio"
                value="voice"
                checked={inputMode === 'voice'}
                onChange={() => setInputMode('voice')}
              />
              Voice Input
            </label>
            <label>
              <input
                type="radio"
                value="typing"
                checked={inputMode === 'typing'}
                onChange={() => setInputMode('typing')}
              />
              Typing Input
            </label>
          </div>

          {inputMode === 'voice' && (
            <div className="voice-selection">
              <p>Select Voice Type:</p>
              <label>
                <input
                  type="radio"
                  value="1"
                  checked={voiceType === '1'}
                  onChange={() => setVoiceType('1')}
                />
                Female Voice 1
              </label>
              <label>
                <input
                  type="radio"
                  value="2"
                  checked={voiceType === '2'}
                  onChange={() => setVoiceType('2')}
                />
                Female Voice 2
              </label>
              <label>
                <input
                  type="radio"
                  value="3"
                  checked={voiceType === '3'}
                  onChange={() => setVoiceType('3')}
                />
                Male Voice 3
              </label>
            </div>
          )}

          <button className="start-button" onClick={startGame}>
            Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;