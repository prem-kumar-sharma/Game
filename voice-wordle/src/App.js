import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Grid from './components/Grid';
import Header from './components/Header';
import Result from './components/Result';
import words from './words';

function App() {
  const location = useLocation();
  const { name, gender, inputMode } = location.state || { name: 'Player', gender: 'female', inputMode: 'voice' };
  const [currentWord, setCurrentWord] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [typedGuess, setTypedGuess] = useState(''); // to handle typed input

  // Function to speak text with selected voice type
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(voice => voice.name.includes(gender === 'male' ? 'Male' : 'Female')) || voices[0];
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
    speak(`Welcome ${name}, let's play Voice Wordle. You have six attempts to guess the word.`);
  }, [name, gender]);

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const guess = event.results[0][0].transcript.trim().toUpperCase();
      if (guess.length === 5) {
        checkGuess(guess);
      } else {
        speak("Please speak a 5-letter word.");
      }
    };

    recognition.onerror = () => {
      speak("An error occurred. Please try again.");
    };

    recognition.start();
  };

  const handleTypingInput = (e) => {
    e.preventDefault();
    if (typedGuess.length === 5) {
      checkGuess(typedGuess.toUpperCase());
      setTypedGuess(''); // reset input
    } else {
      speak("Please enter a 5-letter word.");
    }
  };

  const checkGuess = (guess) => {
    setGuesses([...guesses, guess]);

    if (guess === currentWord) {
      setGameStatus('win');
      speak(`Congratulations ${name}, you guessed the word!`);
    } else if (attempts >= 5) {
      setGameStatus('lose');
      speak(`Sorry ${name}, the correct word was ${currentWord}.`);
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
    if (correctLetters.length > 0) feedback += `Correct: ${correctLetters.join(', ')}. `;
    if (misplacedLetters.length > 0) feedback += `Misplaced: ${misplacedLetters.join(', ')}. `;
    if (incorrectLetters.length > 0) feedback += `Incorrect: ${incorrectLetters.join(', ')}. `;

    feedback += `You have ${5 - attempts} attempts left.`;
    speak(feedback);
  };

  const resetGame = () => {
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
    setGuesses([]);
    setAttempts(0);
    setGameStatus('playing');
    speak("The game has been reset. Start guessing the new word.");
  };

  return (
    <div className="App">
      <Header />
      {gameStatus === 'playing' ? (
        <>
          <Grid guesses={guesses} currentWord={currentWord} />

          {inputMode === 'voice' ? (
            <button className="voice-button" onClick={handleVoiceInput}>Start Voice Input</button>
          ) : (
            <form onSubmit={handleTypingInput}>
              <input
                type="text"
                value={typedGuess}
                onChange={(e) => setTypedGuess(e.target.value)}
                maxLength={5}
                placeholder="Type your guess"
              />
              <button type="submit">Submit Guess</button>
            </form>
          )}
        </>
      ) : (
        <Result gameStatus={gameStatus} resetGame={resetGame} word={currentWord} />
      )}
    </div>
  );
}

export default App;
