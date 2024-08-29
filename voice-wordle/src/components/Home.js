import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/play');
  };

  return (
    <div className="home">
      <div className="overlay">
        <div className="content">
          <h1 className="title">Welcome to Voice Wordle</h1>
          <p className="description">Test your word-guessing skills with voice commands!</p>
          <div className="rules">
            <h2>Game Rules</h2>
            <ul>
              <li>Guess the word in 6 attempts.</li>
              <li>Use voice commands to input your guesses.</li>
              <li>Green indicates correct letters in the right position.</li>
              <li>Yellow indicates correct letters in the wrong position.</li>
              <li>Gray indicates incorrect letters.</li>
            </ul>
          </div>
          <button className="start-button" onClick={startGame}>Let's Play!</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
