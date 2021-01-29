import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { Layer, Rect, Stage } from "react-konva";

const Canvaswrap = styled.div`
  width: 986px;
  height: 536px;
  background: red;
`;

const Stagewrap = styled.div`
  width: 500px;
  height: 300px;
  background: black;
`;

const KonvaStage = ({ width, height }) => {
  const canvasRef = useRef(null);
  const rectRef = useRef(null);

  const handleGroupdragBoundFunc = (pos) => {
    const rectNode = rectRef.current;
    const layerWidth = rectNode.width();
    const layerHeight = rectNode.height();

    if (pos.x < 0) pos.x = 0;
    if (pos.y < 0) pos.y = 0;
    if (pos.x > 500 - layerWidth) pos.x = 500 - layerWidth;
    if (pos.y > 300 - layerHeight) pos.y = 300 - layerHeight;

    return pos;
  };

  const setResolution = useCallback(() => {
    const canvasWidth = canvasRef.current.offsetWidth;
    const canvasHeight = canvasRef.current.offsetHeight;
    const scaleX = width / canvasWidth;
    const scaleY = height / canvasHeight;
    console.log(scaleX, scaleY);
  }, [width, height]);

  useEffect(() => {
    setResolution();
  }, [setResolution]);
  return (
    <>
      <Canvaswrap ref={canvasRef}>
        <Stagewrap>
          <Stage width={500} height={300}>
            <Layer>
              <Rect
                ref={rectRef}
                draggable={true}
                width={50}
                height={50}
                fill="blue"
                dragBoundFunc={handleGroupdragBoundFunc}
              />
            </Layer>
          </Stage>
        </Stagewrap>
      </Canvaswrap>
    </>
  );
};

export default KonvaStage;
