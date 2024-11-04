import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Grid from './components/Grid';
import Header from './components/Header';
import Result from './components/Result';
import words from './words';

function App() {
  const location = useLocation();
  const {
    name = 'Player',
    inputMode = 'voice',
    voiceType = '1',
  } = location.state || {};

  const [currentWord, setCurrentWord] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState('waiting');
  const [typedGuess, setTypedGuess] = useState('');

  const recognitionRef = useRef(null);

  // Voice options based on voiceType
  const voiceOptions = {
    '1': ['Google UK English Female', 'Microsoft Zira Desktop - English (United States)', 'Google Australian English Female'],
    '2': ['Google US English Male', 'Microsoft Guy Online (Natural) - English (United States)', 'Google Canadian English Male'],
    '3': ['Google UK English Male', 'Microsoft David Desktop - English (United States)', 'Google Australian English Male'],
  };

  // Function to get voices with a timeout fallback
  const getVoices = () => {
    console.log('Getting voices...');
    return new Promise((resolve) => {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length !== 0) {
        console.log('Voices retrieved:', voices);
        resolve(voices);
      } else {
        const voicesChanged = () => {
          voices = window.speechSynthesis.getVoices();
          console.log('Voices changed, retrieved:', voices);
          resolve(voices);
        };
        window.speechSynthesis.onvoiceschanged = voicesChanged;
        // Fallback if onvoiceschanged doesn't fire
        setTimeout(() => {
          voices = window.speechSynthesis.getVoices();
          console.log('Fallback voices retrieved:', voices);
          resolve(voices);
        }, 1000);
      }
    });
  };

  // Function to speak text with selected voice type
  const speak = async (text) => {
    console.log('Speaking text:', text);
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = await getVoices();
    const selectedVoiceNames = voiceOptions[voiceType] || voiceOptions['1'];

    // Filter available voices to match the selected voices
    const availableVoices = voices.filter((voice) =>
      selectedVoiceNames.includes(voice.name)
    );
    console.log('Available voices:', availableVoices);

    // Randomly select one of the available voices
    if (availableVoices.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableVoices.length);
      utterance.voice = availableVoices[randomIndex];
      console.log('Selected voice:', availableVoices[randomIndex].name);
    } else {
      utterance.voice = null; // Fallback to default voice
      console.log('Fallback to default voice');
    }

    // Ensure previous speech tasks are cancelled
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      console.log('Cancelling previous speech tasks');
      window.speechSynthesis.cancel();
    }

    window.speechSynthesis.speak(utterance);

    // Return a promise that resolves when speech ends
    return new Promise((resolve) => {
      utterance.onend = () => {
        console.log('Speech ended');
        resolve();
      };
    });
  };

  const startGame = async () => {
    console.log('Starting game...');
    const word = words[Math.floor(Math.random() * words.length)];
    console.log('Selected word:', word);
    setCurrentWord(word);

    // Speak welcome message and wait for it to finish
    await speak(`Welcome ${name}, Let's play Voice Wordle!`);
    await speak('Say "Start" to begin the game.');
    waitForStartCommand();
  };

  const waitForStartCommand = () => {
    console.log('Waiting for start command...');
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.trim().toLowerCase();
      console.log('Recognition result:', command);
      if (command === 'start') {
        if (inputMode === 'typing') {
          speak('Great! Start typing to guess the word.');
        } else {
          speak('Great! Click on the Start Voice Input button to begin guessing words.');
        }
        setGameStatus('playing');
      } else {
        speak('Please say "Start" to begin.');
        waitForStartCommand();
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error detected:', event.error);
      if (event.error === 'aborted') {
        // Ignore the aborted error
        return;
      }
      speak('An error occurred. Please try again.');
      waitForStartCommand();
    };

    recognition.start();
    console.log('Speech recognition started');
    recognitionRef.current = recognition;
  };

  const handleVoiceInput = () => {
    console.log('Handling voice input...');
    stopRecognition();  // Ensure any previous recognition is stopped

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const guess = event.results[0][0].transcript.trim().toUpperCase();
      console.log('Voice input result:', guess);
      if (guess.length === 5) {
        checkGuess(guess);
      } else {
        speak('Please speak a 5-letter word.');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error detected:', event.error);
      if (event.error === 'aborted') {
        // Ignore the aborted error
        return;
      }
      speak('An error occurred. Please try again.');
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      if (gameStatus === 'playing') {
        speak('Click the button to guess another word.');
      }
    };

    recognition.start();
    console.log('Speech recognition started for voice input');
    recognitionRef.current = recognition;
  };

  const handleTypingInput = (e) => {
    e.preventDefault();
    console.log('Handling typing input:', typedGuess);
    if (typedGuess.length === 5) {
      stopRecognition();  // Ensure speech recognition is stopped before proceeding
      checkGuess(typedGuess.toUpperCase());
      setTypedGuess('');
    } else {
      console.log('Please enter a 5-letter word.');
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      console.log('Stopping speech recognition');
      recognitionRef.current.stop();  // Gracefully stop recognition
      recognitionRef.current = null;  // Clear reference
    }
  };

  const checkGuess = (guess) => {
    console.log('Checking guess:', guess);
    setGuesses([...guesses, guess]);

    if (guess === currentWord) {
      console.log('Guess is correct!');
      setGameStatus('win');
      stopRecognition();
      speak(`Congratulations ${name}, you guessed the word!`).then(() => {
        speak('Game Over! You won.');
      });
    } else if (attempts >= 5) {
      console.log('Max attempts reached. Game over.');
      setGameStatus('lose');
      stopRecognition();
      speak(`Sorry ${name}, the correct word was ${currentWord}.`).then(() => {
        speak('Game Over! You lost.');
      });
    } else {
      console.log('Guess is incorrect. Attempts left:', 5 - attempts);
      setAttempts(attempts + 1);
      setTimeout(() => giveCollectiveFeedback(guess), 300);  // Add delay before speaking feedback
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
      feedback += `Letters ${misplacedLetters.join(', ')} are in the word but in the wrong position. `;
    }
    if (incorrectLetters.length > 0) {
      feedback += `Letters ${incorrectLetters.join(', ')} are not in the word. `;
    }

    feedback += `You have ${5 - attempts} attempts left.`;

    // Log the feedback to the console for debugging
    console.log('Feedback:', feedback);

    // Provide the feedback via speech with delay to ensure smoother transition
    setTimeout(() => speak(feedback), 500);  // Added delay to ensure speech happens smoothly
  };

  const resetGame = async () => {
    stopRecognition();  // Stop any ongoing recognition
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
    setGuesses([]);
    setAttempts(0);
    setGameStatus('playing');
    await speak('The game has been reset. Start guessing the new word.');
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopRecognition();  // Ensure recognition is stopped when component unmounts
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="App">
      <Header />
      {gameStatus === 'waiting' && (
        <>
          <button
            onClick={async () => {
              await startGame();
            }}
            className="start-game-button"
          >
            Start
          </button>
        </>
      )}
      {gameStatus === 'playing' && (
        <>
          <Grid guesses={guesses} currentWord={currentWord} />
          {inputMode === 'typing' && (
            <form onSubmit={handleTypingInput}>
              <input
                type="text"
                value={typedGuess}
                onChange={(e) => setTypedGuess(e.target.value)}
                maxLength={5}
                placeholder="Type your guess"
              />
              <button type="submit" className="submit-guess-button" style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}>Submit Guess</button>
            </form>
          )}
          {inputMode === 'voice' && (
            <button onClick={handleVoiceInput} className="voice-button">
              Start Voice Input
            </button>
          )}
        </>
      )}
      {gameStatus !== 'playing' && gameStatus !== 'waiting' && (
        <Result gameStatus={gameStatus} resetGame={resetGame} word={currentWord} />
      )}
    </div>
  );
}

export default App;
