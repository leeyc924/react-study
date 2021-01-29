import React, { useState } from "react";
import KonvaStage from "./components/KonvaStage";
import Resolution from "./components/Resolution";

function App() {
  const [value, setValue] = useState({
    width: 1920,
    height: 1080,
  });

  const { width, height } = value;
  const onChange = (e) => {
    const { name } = e.target;
    setValue({
      ...value,
      [name]: e.target.value,
    });
  };
  return (
    <>
      <Resolution width={width} height={height} onChange={onChange} />
      <br />
      <br />
      <KonvaStage width={width} height={height} />
    </>
  );
}

export default App;
