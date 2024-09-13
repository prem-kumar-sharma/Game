import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('female');
  const [inputMode, setInputMode] = useState('voice'); 
  const navigate = useNavigate();

  const startGame = () => {
    if (name) {
      navigate('/play', { state: { name, gender, inputMode } });
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

          <div className="gender-selection">
            <label>
              <input
                type="radio"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
              />
              Female
            </label>
          </div>

          <div className="input-mode-selection">
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

          <button className="start-button" onClick={startGame}>Let's Play!</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
