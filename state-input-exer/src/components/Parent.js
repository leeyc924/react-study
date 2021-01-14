import React, { useState } from "react";
import Child from "./Child";

const Parent = () => {
  const [value, setValue] = useState("");
  const handleChange = (value) => {
    setValue(value);
  };
  return <Child value={value} handleChange={handleChange} />;
};

export default Parent;
