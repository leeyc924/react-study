import React from "react";

const Counter = ({ number, onIncrease, onDecrease }) => {
  return (
    <>
      {number}
      <button onClick={onIncrease}>+1</button>
      <button onDecrease={onDecrease}>-1</button>
    </>
  );
};

export default Counter;
