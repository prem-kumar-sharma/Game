import React from 'react';
import Cell from './Cell';
import './Grid.css';

const Grid = ({ guesses, currentWord }) => {
  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < 6; i++) {
      const guess = guesses[i] || '';
      rows.push(
        <div key={i} className="grid-row">
          {Array.from({ length: 5 }).map((_, j) => {
            const letter = guess[j] || '';
            let status = '';
            
            if (letter) {
              if (guess[j] === currentWord[j]) {
                status = 'correct';
              } else if (currentWord.includes(guess[j])) {
                status = 'present';
              } else {
                status = 'absent';
              }
            }

            return (
              <Cell
                key={j}
                value={letter}
                status={status}
                animate={!!letter}
              />
            );
          })}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="magical-grid">
      <div className="grid-container">
        {renderRows()}
      </div>
    </div>
  );
};

export default Grid;