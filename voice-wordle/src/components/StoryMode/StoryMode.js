import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from '../Grid/Grid';
import { getStoryWord, isValidWord } from '../../utils/words';
import { loadGameProgress, updateProgress } from '../../utils/gameProgress';
import './StoryMode.css';

const StoryMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    name = 'Adventurer',
    inputMode = 'voice',
    voiceType = '1',
    initialLevel = 1,
  } = location.state || {};

  // Game States
  const [gameStatus, setGameStatus] = useState('intro');
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [progress, setProgress] = useState(() => loadGameProgress());
  const [currentWord, setCurrentWord] = useState('');
  const [wordData, setWordData] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [typedGuess, setTypedGuess] = useState('');
  const [unlockedCharacters, setUnlockedCharacters] = useState([]);
  const recognitionRef = useRef(null);

  // Story States
  const [currentScene, setCurrentScene] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);

  // Story dialogue sequences
  const storyScenes = {
    intro: [
      `Welcome, ${name}, to the Whisper World.`,
      "This realm was once filled with voices and laughter...",
      "Until Queen Murmura cast her silence spell, trapping everyone's voices.",
      "You have the power to break this curse, one word at a time.",
      "Each correct word you guess will free a voice from the silence.",
    ],
    levelStart: (level) => [
      `Level ${level} begins...`,
      `A new voice awaits to be freed.`,
      `Listen carefully and speak the magic word.`
    ],
    victory: (characterName) => [
      `The spell breaks!`,
      `${characterName}'s voice has been restored!`,
      `The magic grows stronger with each freed voice.`
    ]
  };

  // Voice options based on character
  const voiceOptions = {
    '1': ['Google UK English Female', 'Microsoft Zira Desktop - English (United States)'],
    '2': ['Google US English Male', 'Microsoft David Desktop - English (United States)'],
    '3': ['Google UK English Male', 'Microsoft Mark Desktop - English (United States)']
  };

  // Initialize level
  useEffect(() => {
    if (gameStatus === 'playing') {
      initializeLevel(currentLevel);
    }
  }, [gameStatus, currentLevel]);

  const initializeLevel = async (level) => {
    const newWordData = getStoryWord(level);
    setWordData(newWordData);
    setCurrentWord(newWordData.word);
    await speak(`Level ${level} - ${newWordData.theme} Challenge`);
  };

  // Get available voices
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

  // Speak with character voices
  const speak = async (text, character = 'narrator') => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = await getVoices();
    const selectedVoiceNames = voiceOptions[voiceType] || voiceOptions['1'];
    const availableVoices = voices.filter((voice) =>
      selectedVoiceNames.includes(voice.name)
    );

    if (availableVoices.length > 0) {
      utterance.voice = availableVoices[0];
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    window.speechSynthesis.speak(utterance);

    return new Promise((resolve) => {
      utterance.onend = resolve;
    });
  };

  // Play story sequence
  const playStorySequence = async (scenes) => {
    for (let i = 0; i < scenes.length; i++) {
      setCurrentScene(i);
      await speak(scenes[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setGameStatus('playing');
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const guess = event.results[0][0].transcript.trim().toUpperCase();
      if (guess.length === 5) {
        checkGuess(guess);
      } else {
        speak("The magical word must be five letters long. Try again!");
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // Handle typing input
  const handleTypingInput = (e) => {
    e.preventDefault();
    if (typedGuess.length === 5) {
      checkGuess(typedGuess.toUpperCase());
      setTypedGuess('');
    }
  };

  // Check guess
  const checkGuess = async (guess) => {
    if (!isValidWord(guess)) {
      speak('That word does not exist in this realm. Try another.');
      return;
    }

    setGuesses([...guesses, guess]);

    if (guess === currentWord) {
      await handleLevelComplete();
    } else if (attempts >= 5) {
      handleLevelFailed();
    } else {
      setAttempts(prev => prev + 1);
      provideMagicalFeedback(guess);
    }
  };

  const handleLevelComplete = async () => {
    setGameStatus('win');
    const updatedProgress = updateProgress({
      ...progress,
      currentLevel,
      unlockedCharacters: [...progress.unlockedCharacters, currentLevel]
    });
    setProgress(updatedProgress);
    
    await speak("The spell is breaking! A voice has been freed!");
    await playStorySequence(storyScenes.victory(wordData.character));
  };

  const handleLevelFailed = async () => {
    setGameStatus('lose');
    await speak("The magic fades... but don't give up! Try again.");
  };

  // Provide magical feedback
  const provideMagicalFeedback = (guess) => {
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

    let feedback = "The magical crystals reveal: ";
    if (correctLetters.length > 0) {
      feedback += `The letters ${correctLetters.join(', ')} glow with perfect alignment. `;
    }
    if (misplacedLetters.length > 0) {
      feedback += `The letters ${misplacedLetters.join(', ')} shimmer, but seek their true place. `;
    }
    if (incorrectLetters.length > 0) {
      feedback += `The letters ${incorrectLetters.join(', ')} fade into shadow. `;
    }

    speak(feedback);
  };

  // Reset level
  const resetLevel = async () => {
    setGuesses([]);
    setAttempts(0);
    setGameStatus('playing');
    initializeLevel(currentLevel);
  };

  // Start next level
  const startNextLevel = async () => {
    const nextLevel = currentLevel + 1;
    setCurrentLevel(nextLevel);
    setGuesses([]);
    setAttempts(0);
    setGameStatus('playing');
    await playStorySequence(storyScenes.levelStart(nextLevel));
    initializeLevel(nextLevel);
  };

  // Effect to start story
  useEffect(() => {
    if (gameStatus === 'intro') {
      playStorySequence(storyScenes.intro)
        .then(() => playStorySequence(storyScenes.levelStart(currentLevel)))
        .then(() => setGameStatus('playing'));
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="story-mode">
      <div className="magical-realm">
        <div className="realm-content">
          <div className="story-header">
            <button onClick={() => navigate('/')} className="return-portal">
              ← Return to Portal
            </button>
            <div className="player-info">
              <span className="player-name">{name}</span>
              <span className="level-indicator">Level {currentLevel}</span>
            </div>
          </div>

          {gameStatus === 'intro' && (
            <div className="story-scene">
              <div className="dialogue-box">
                <p>{storyScenes.intro[currentScene]}</p>
              </div>
            </div>
          )}

          {gameStatus === 'playing' && (
            <div className="game-area">
              <Grid guesses={guesses} currentWord={currentWord} />
              
              {inputMode === 'voice' ? (
                <button onClick={handleVoiceInput} className="spell-cast-button">
                  🎙️ Cast Your Spell
                </button>
              ) : (
                <form onSubmit={handleTypingInput} className="scroll-input">
                  <input
                    type="text"
                    value={typedGuess}
                    onChange={(e) => setTypedGuess(e.target.value)}
                    maxLength={5}
                    placeholder="Write your spell..."
                    className="magical-input"
                  />
                  <button type="submit" className="cast-button">
                    Cast Spell
                  </button>
                </form>
              )}

              <div className="magical-attempts">
                Spell Attempts: {attempts}/6
              </div>
            </div>
          )}

          {gameStatus === 'win' && (
            <div className="victory-scene">
              <h2>Voice Freed!</h2>
              <p>You've broken part of the silence spell!</p>
              <button onClick={startNextLevel} className="continue-button">
                Continue Journey
              </button>
            </div>
          )}

          {gameStatus === 'lose' && (
            <div className="defeat-scene">
              <h2>Magic Faded</h2>
              <p>But hope remains! Try again, brave {name}.</p>
              <button onClick={resetLevel} className="retry-button">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryMode;