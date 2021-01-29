import React from "react";

const Resolution = ({ width, height, onChange }) => {
  return (
    <>
      <label htmlFor={1}>width : </label>
      <input
        value={width}
        name="width"
        id={1}
        onChange={(e) => onChange(e)}
        style={{ marginRight: "10px" }}
      />
      <label htmlFor={2}>height : </label>
      <input
        value={height}
        name="height"
        id={2}
        onChange={(e) => onChange(e)}
      />
    </>
  );
};

export default Resolution;
