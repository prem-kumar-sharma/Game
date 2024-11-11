// Game state management
export const GameModes = {
    CLASSIC: 'classic',
    STORY: 'story'
  };
  
  export const GameStates = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    VICTORY: 'victory',
    DEFEAT: 'defeat',
    CUTSCENE: 'cutscene'
  };
  
  export const validateGuess = (guess, currentWord) => {
    if (!guess || guess.length !== 5) {
      return {
        isValid: false,
        message: 'Please enter a 5-letter word'
      };
    }
  
    return {
      isValid: true,
      result: Array.from(guess).map((letter, index) => ({
        letter,
        status: letter === currentWord[index] 
          ? 'correct' 
          : currentWord.includes(letter) 
            ? 'present' 
            : 'absent'
      }))
    };
  };
  
  export const checkWinCondition = (guesses, currentWord) => {
    return guesses.some(guess => guess === currentWord);
  };
  
  export const checkLoseCondition = (guesses, maxAttempts) => {
    return guesses.length >= maxAttempts;
  };
  
  export const getGameFeedback = (gameMode, result) => {
    const feedback = {
      classic: {
        win: {
          title: 'Congratulations!',
          message: 'You solved the puzzle!'
        },
        lose: {
          title: 'Game Over',
          message: 'Better luck next time!'
        }
      },
      story: {
        win: {
          title: 'Magic Restored!',
          message: 'Another voice has been freed!'
        },
        lose: {
          title: 'The Magic Fades...',
          message: 'But hope remains! Try again!'
        }
      }
    };
  
    return feedback[gameMode][result];
  };
  
  // Helper functions for game logic
  export const generateHint = (word, difficulty) => {
    switch(difficulty) {
      case 'easy':
        return `First letter is '${word[0]}'`;
      case 'medium':
        return `Contains the letter '${word[Math.floor(word.length / 2)]}'`;
      case 'hard':
        return 'No hints available';
      default:
        return '';
    }
  };
  
  export const calculateScore = (attempts, maxAttempts, timeSpent) => {
    const baseScore = 1000;
    const attemptMultiplier = (maxAttempts - attempts + 1) / maxAttempts;
    const timeMultiplier = Math.max(0, 1 - (timeSpent / 300)); // 5 minutes max
    return Math.floor(baseScore * attemptMultiplier * timeMultiplier);
  };