import React from "react";
import Tree from './components/Tree';
import { Global } from "./asset/styles";

function App() {
  return (
    <>
      <Global />
      <Tree name="main" defaultOpen>
        <Tree name={<button>🙀 something something</button>} style={{ color: "#37ceff" }} />
      </Tree>
    </>
  );
}

export default App;
