import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Layer, Rect, Stage } from "react-konva";

const Canvaswrap = styled.div`
  width: 986px;
  height: 536px;
  background: red;
  display: flex;
  justify-content:center;
  align-items: center;
`;

const Stagewrap = styled.div`
  width: ${({ width }) => width && width}px;
  height: ${({ height }) => height && height}px;
  background: black;
`;

const KonvaStage = ({ width, height }) => {
  const canvasRef = useRef(null);
  const rectRef = useRef(null);
  const [stageSize, setStageSize] = useState({
    width: 0,
    height: 0,
  });

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

  const setResolution = useCallback((width, height) => {
    const canvasWidth = canvasRef.current.offsetWidth;
    const canvasHeight = canvasRef.current.offsetHeight;
    const scaleX = canvasWidth / width;
    const scaleY = canvasHeight / height;
    const stageWidth = width * scaleX;
    const stageHeight = height * scaleY;
    console.log(width, height);
    console.log(canvasWidth);
    console.log(canvasHeight);
    console.log(scaleX);
    console.log(scaleY);
    setStageSize({
      width: stageWidth,
      height: stageHeight,
    });
  }, []);

  useEffect(() => {
   setResolution(width, height); 
  }, [setResolution, width, height]);
  console.log(stageSize);
  return (
    <>
      <Canvaswrap ref={canvasRef}>
        <Stagewrap width={stageSize.width} height={stageSize.height}>
          <Stage width={stageSize.width} height={stageSize.height}>
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
