import React from 'react';
import Cell from './Cell';

const Grid = ({ guesses, currentWord, attempts }) => {
  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < 6; i++) {
      const guess = guesses[i] || '';
      rows.push(
        <div key={i} className="row">
          {Array.from({ length: 5 }).map((_, j) => (
            <Cell
              key={j}
              value={guess[j] || ''}
              correct={guess[j] === currentWord[j]}
              almost={guess && currentWord.includes(guess[j]) && guess[j] !== currentWord[j]}
            />
          ))}
        </div>
      );
    }
    return rows;
  };

  return <div className="grid">{renderRows()}</div>;
};

export default Grid;
