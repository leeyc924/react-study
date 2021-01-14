import React from "react";

const ChildChild = ({ value, handleChange }) => {
  return <input value={value} onChange={(e) => handleChange(e.target.value)} />;
};

export default ChildChild;
