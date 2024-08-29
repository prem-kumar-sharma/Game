import React from 'react';
import './Result.css';

const Result = ({ gameStatus, resetGame, word }) => {
  console.log('Game Status:', gameStatus);
  console.log('Word:', word);

  return (
    <div className="result">
      <h1>{gameStatus === 'win' ? 'Congratulations!' : 'Game Over!'}</h1>
      <p>{gameStatus === 'win' ? 'You guessed the word correctly!' : `The correct word was: ${word}`}</p>
      <button className="play-again-button" onClick={resetGame}>Play Again</button>
    </div>
  );
};

export default Result;
