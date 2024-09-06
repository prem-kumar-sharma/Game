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

  // Function to speak text
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
    speak("Welcome to Voice Wordle. Guess the word by speaking. You have 6 attempts.");
  }, []);

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false; // Stop automatically after result

    recognition.onresult = (event) => {
      const guess = event.results[0][0].transcript.trim().toUpperCase();
      if (guess.length === 5) {
        checkGuess(guess);
      } else {
        speak("Please speak a 5-letter word.");
      }
    };

    recognition.onerror = (event) => {
      console.error(`Error occurred: ${event.error}`);
      speak("An error occurred. Please try again.");
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.start();
  };

  const checkGuess = (guess) => {
    setGuesses([...guesses, guess]);

    if (guess === currentWord) {
      setGameStatus('win');
      speak("Congratulations! You guessed the word correctly!");
    } else if (attempts >= 5) {
      setGameStatus('lose');
      speak(`Game over! The correct word was ${currentWord}.`);
    } else {
      setAttempts(attempts + 1);
      giveCollectiveFeedback(guess);
    }
  };

  // Provide collective feedback on the guess
  const giveCollectiveFeedback = (guess) => {
    let correctLetters = [];
    let misplacedLetters = [];
    let incorrectLetters = [];

    for (let i = 0; i < 5; i++) {
      if (guess[i] === currentWord[i]) {
        correctLetters.push(guess[i]);
      } else if (currentWord.includes(guess[i])) {
        misplacedLetters.push(guess[i]);
      } else {
        incorrectLetters.push(guess[i]);
      }
    }

    let feedback = '';
    if (correctLetters.length > 0) {
      feedback += `Letters ${correctLetters.join(', ')} are in the correct position. `;
    }
    if (misplacedLetters.length > 0) {
      feedback += `Letters ${misplacedLetters.join(', ')} are in the word but in the wrong position. `;
    }
    if (incorrectLetters.length > 0) {
      feedback += `Letters ${incorrectLetters.join(', ')} are not in the word. `;
    }

    feedback += `You have ${6 - attempts} attempts remaining.`;
    speak(feedback);
  };

  const resetGame = () => {
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
    setGuesses([]);
    setAttempts(0);
    setGameStatus('playing');
    speak("Game reset. Please start guessing the new word.");
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
