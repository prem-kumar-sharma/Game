import React, { useEffect } from 'react';
import './Result.css';

const Result = ({ gameStatus, resetGame, word }) => {
  useEffect(() => {
    // Add magical particles effect when component mounts
    const createParticles = () => {
      const particles = document.createElement('div');
      particles.className = `magical-particles ${gameStatus}`;
      document.querySelector('.result-container')?.appendChild(particles);
      
      return () => particles.remove();
    };

    return createParticles();
  }, [gameStatus]);

  const getResultMessage = () => {
    if (gameStatus === 'win') {
      return {
        title: '✨ Magical Victory! ✨',
        message: 'The spell has been broken!',
        submessage: `You discovered the magical word: ${word}`
      };
    } else {
      return {
        title: '🌙 The Magic Fades... 🌙',
        message: 'But hope remains!',
        submessage: `The magical word was: ${word}`
      };
    }
  };

  const message = getResultMessage();

  return (
    <div className="result-container">
      <div className={`result-card ${gameStatus}`}>
        <div className="result-content">
          <h1 className="result-title">{message.title}</h1>
          <p className="result-message">{message.message}</p>
          <p className="magical-word">{message.submessage}</p>
          
          <button 
            className="magical-button"
            onClick={resetGame}
          >
            <span className="button-text">
              {gameStatus === 'win' ? 'Cast Another Spell' : 'Try Again'}
            </span>
            <div className="button-glow"></div>
          </button>
        </div>

        {gameStatus === 'win' && (
          <div className="victory-effects">
            <div className="sparkles"></div>
            <div className="magical-rings"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;