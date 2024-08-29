import React from 'react';

const Cell = ({ value, correct, almost }) => {
  let className = "cell";
  if (correct) className += " correct";
  else if (almost) className += " almost";
  
  return (
    <div className={className}>
      {value}
    </div>
  );
};

export default Cell;
