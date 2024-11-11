import React from 'react';
import './Grid.css';

const Cell = ({ value, status, animate }) => {
  return (
    <div 
      className={`cell ${status} ${animate ? 'pop' : ''}`}
      data-value={value}
    >
      {value}
    </div>
  );
};

export default Cell;