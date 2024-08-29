import React from 'react';

const Result = ({ gameStatus, resetGame, word }) => {
  return (
    <div className="result">
      <h1>{gameStatus === 'win' ? 'Congratulations!' : 'Game Over!'}</h1>
      <p>{gameStatus === 'win' ? 'You guessed the word correctly!' : `The correct word was: ${word}`}</p>
      <button onClick={resetGame}>Play Again</button>
    </div>
  );
};

export default Result;
