import React from "react";
import ChildChild from "./ChildChild";

const Child = ({ value, handleChange }) => {
  return <ChildChild value={value} handleChange={handleChange} />;
};

export default Child;
