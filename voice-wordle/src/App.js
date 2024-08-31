import React, { useState, useEffect } from 'react';
import Grid from './components/Grid';
import Header from './components/Header';
import Result from './components/Result';
import words from './words';

function App() {
  const [currentWord, setCurrentWord] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');

  useEffect(() => {
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
  }, []);

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true; // Keep listening until manually stopped

    recognition.onresult = (event) => {
      const guess = event.results[0][0].transcript.trim().toUpperCase();
      if (guess.length === 5) {
        recognition.stop(); // Stop listening once a valid guess is detected
        checkGuess(guess);
      } else {
        alert("Please speak a 5-letter word.");
      }
    };

    recognition.onerror = (event) => {
      console.error(`Error occurred: ${event.error}`);
      alert("An error occurred with the voice recognition. Please try again.");
      recognition.stop(); // Stop to prevent it from hanging
    };

    recognition.onspeechend = () => {
      // If no speech detected for some time, stop the recognition
      recognition.stop();
      alert("No voice detected. Please try again.");
    };

    recognition.start();
  };

  const checkGuess = (guess) => {
    setGuesses([...guesses, guess]);

    if (guess === currentWord) {
      setGameStatus('win');
    } else if (attempts >= 5) {
      setGameStatus('lose');
    } else {
      setAttempts(attempts + 1);
    }
  };

  const resetGame = () => {
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
    setGuesses([]);
    setAttempts(0);
    setGameStatus('playing');
  };

  return (
    <div className="App">
      {gameStatus === 'playing' ? (
        <>
          <Header />
          <Grid guesses={guesses} currentWord={currentWord} />
          <button className="voice-button" onClick={handleVoiceInput}>Start Voice Input</button>
        </>
      ) : (
        <Result gameStatus={gameStatus} resetGame={resetGame} word={currentWord} />
      )}
    </div>
  );
}

export default App;
