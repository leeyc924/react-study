import React from 'react';

const Searchbar = ({value, handleChange}) => {
  return (
    <input value={value} onChange={(e) => handleChange(e.target.value)} />
  );
};

export default Searchbar;
