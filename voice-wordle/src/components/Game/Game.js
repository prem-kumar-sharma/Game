import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from '../Grid/Grid';
import Result from '../Result/Result';
import { getClassicWord, isValidWord } from '../../utils/words';
import './Game.css';

function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    name = 'Player',
    inputMode = 'voice',
    voiceType = '1',
  } = location.state || {};

  // Game states
  const [currentWord, setCurrentWord] = useState(() => getClassicWord()); // Initialize with random word
  const [attempts, setAttempts] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState('waiting');
  const [typedGuess, setTypedGuess] = useState('');
  const recognitionRef = useRef(null);

  // Voice options based on mode (classic or crystal themes)
  const voiceOptions = {
    '1': ['Google UK English Female', 'Microsoft Zira Desktop - English (United States)'],
    '2': ['Google US English Male', 'Microsoft David Desktop - English (United States)'],
    '3': ['Google UK English Male', 'Microsoft Mark Desktop - English (United States)']
  };

  // Function to get voices with a timeout fallback
  const getVoices = () => {
    return new Promise((resolve) => {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length !== 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        };
        setTimeout(() => {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        }, 1000);
      }
    });
  };

  // Function to speak text with selected voice type
  const speak = async (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = await getVoices();
    const selectedVoiceNames = voiceOptions[voiceType] || voiceOptions['1'];
    const availableVoices = voices.filter((voice) =>
      selectedVoiceNames.includes(voice.name)
    );

    if (availableVoices.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableVoices.length);
      utterance.voice = availableVoices[randomIndex];
    }

    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }

    window.speechSynthesis.speak(utterance);

    return new Promise((resolve) => {
      utterance.onend = resolve;
    });
  };

  const startGame = async () => {
    // Get new random word from utils
    const newWord = getClassicWord();
    setCurrentWord(newWord);
    await speak(`Welcome ${name} to Voice Wordle!`);
    await speak('Say "Start" to begin.');
    waitForStartCommand();
  };

  const waitForStartCommand = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.trim().toLowerCase();
      if (command === 'start') {
        if (inputMode === 'typing') {
          speak('Type your first guess!');
        } else {
          speak('Click the microphone when ready to guess.');
        }
        setGameStatus('playing');
      } else {
        speak('Please say "Start" to begin.');
        waitForStartCommand();
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        speak('An error occurred. Please try again.');
        waitForStartCommand();
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleVoiceInput = () => {
    stopRecognition();
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const guess = event.results[0][0].transcript.trim().toUpperCase();
      if (guess.length === 5) {
        checkGuess(guess);
      } else {
        speak('Please speak a 5-letter word.');
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        speak('An error occurred. Please try again.');
      }
    };

    recognition.onend = () => {
      if (gameStatus === 'playing') {
        speak('Ready for your next guess.');
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleTypingInput = (e) => {
    e.preventDefault();
    if (typedGuess.length === 5) {
      stopRecognition();
      checkGuess(typedGuess.toUpperCase());
      setTypedGuess('');
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const checkGuess = (guess) => {
    if (!isValidWord(guess)) {
      speak('That word is not in my dictionary. Try again.');
      return;
    }

    setGuesses([...guesses, guess]);

    if (guess === currentWord) {
      setGameStatus('win');
      stopRecognition();
      speak(`Congratulations ${name}! The word was ${currentWord}!`).then(() => {
        speak('You won! Would you like to play again?');
      });
    } else if (attempts >= 5) {
      setGameStatus('lose');
      stopRecognition();
      speak(`Game Over. The word was ${currentWord}.`).then(() => {
        speak('Better luck next time!');
      });
    } else {
      setAttempts(attempts + 1);
      setTimeout(() => giveCollectiveFeedback(guess), 300);
    }
  };

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
      feedback += `Letters ${misplacedLetters.join(', ')} are in the word but wrong position. `;
    }
    if (incorrectLetters.length > 0) {
      feedback += `Letters ${incorrectLetters.join(', ')} are not in the word. `;
    }
    feedback += `${5 - attempts} attempts remaining.`;

    setTimeout(() => speak(feedback), 500);
  };

  const resetGame = async () => {
    stopRecognition();
    const newWord = getClassicWord();
    setCurrentWord(newWord);
    setGuesses([]);
    setAttempts(0);
    setGameStatus('playing');
    await speak('New game started. Make your guess!');
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopRecognition();
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="game-container">
      <div className="magical-overlay">
        <div className="content">
          <div className="game-header">
            <button onClick={() => navigate('/')} className="back-button">
              ← Back to Menu
            </button>
            <h1 className="game-title">Voice Wordle</h1>
          </div>

          {gameStatus === 'waiting' && (
            <div className="start-section">
              <h2>Welcome, {name}!</h2>
              <p className="instructions">
                Guess the 5-letter word. You have 6 attempts.
              </p>
              <button onClick={startGame} className="magical-button">
                Start Game
              </button>
            </div>
          )}

          {gameStatus === 'playing' && (
            <div className="game-section">
              <Grid guesses={guesses} currentWord={currentWord} />
              
              {inputMode === 'typing' ? (
                <form onSubmit={handleTypingInput} className="input-form">
                  <input
                    type="text"
                    value={typedGuess}
                    onChange={(e) => setTypedGuess(e.target.value)}
                    maxLength={5}
                    placeholder="Type a 5-letter word"
                    className="guess-input"
                  />
                  <button type="submit" className="submit-button">
                    Submit Guess
                  </button>
                </form>
              ) : (
                <button onClick={handleVoiceInput} className="voice-button">
                  🎤 Speak Your Guess
                </button>
              )}

              <div className="attempts-counter">
                Attempts: {attempts}/6
              </div>
            </div>
          )}

          {(gameStatus === 'win' || gameStatus === 'lose') && (
            <div className="result-section">
              <Result 
                gameStatus={gameStatus} 
                resetGame={resetGame} 
                word={currentWord}
              />
              <button onClick={resetGame} className="play-again-button">
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;