import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import throttle from "lodash/throttle";

import {
  Stage,
  Layer as KonvaLayer,
  Rect,
  Circle,
  Group,
  Transformer,
} from "react-konva";
import Konva from "konva";

const horizonResolution = 1000;
const verticalResolution = 500;

const App = () => {
  const [ratio, setRatio] = useState(1);
  const [layerList, setLayerList] = useState(
    Array(5)
      .fill()
      .map(
        (
          arr,
          i // (arr: 현재값, i:인덱스)
        ) => ({
          x: 0,
          y: 0,
          width: 200,
          height: 200,
        })
      )
  );

  // 브라우저 비율에 맞는 가로 해상도
  const ratioHorizon = useMemo(
    () => Math.round(ratio * Number(horizonResolution)),
    [ratio]
  );
  // 브라우저 비율에 맞는 세로 해상도
  const ratioVertical = useMemo(
    () => Math.round(ratio * Number(verticalResolution)),
    [ratio]
  );
  // 플레이어 영역 비율에 맞춰 계산
  const playerAreaInfo = useMemo(
    () => ({
      x: Math.round((window.innerWidth - ratioHorizon - 40) / ratio / 2),
      y: Math.round((window.innerHeight - ratioVertical) / ratio / 2),
      width: Math.round(ratioHorizon / ratio),
      height: Math.round(ratioVertical / ratio),
    }),
    [ratioHorizon, ratioVertical, ratio]
  );

  // window resize에 따른 비율 계산 로직
  const handleResize = useCallback(() => {
    const width = Number(horizonResolution || 1); // 가로 해상도
    const height = Number(verticalResolution || 1); // 세로 해상도
    const scalex = (window.innerWidth - 40) / width;
    const scaley = (window.innerHeight - 40) / height;
    const ratio = scalex < scaley ? scalex : scaley; // 현재 화면에 맞는 비율 정보

    setRatio(ratio);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);



  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      scaleX={ratio}
      scaleY={ratio}
    >
      <KonvaLayer
        x={playerAreaInfo.x}
        y={playerAreaInfo.y}
        scaleX={1}
        scaleY={1}
      >
        <Rect
          width={playerAreaInfo.width}
          height={playerAreaInfo.height}
          fill="black"
        />
        {layerList.map(layer => (
          <Layer layerProps={layer} updateLayerState handleClickLayer isSelected />
        ))}
      </KonvaLayer>
    </Stage>
  );
};

const Layer = ({
  layerProps,
  updateLayerState,
  handleClickLayer,
  isSelected,
}) => {
  const groupRef = useRef(null);
  const trRef = useRef(null);

  // 레이어 크기 편집
  const handleBoundBoxFunc = (oldBox, newBox) => {
    const newWidth = Math.round(newBox.width);
    const newHeight = Math.round(newBox.height);

    if (newWidth < 0 || newHeight < 0) {
      return oldBox;
    }
    return newBox;
  };

  // 레이어 드레그 시작
  const handleGroupDragStart = (e) => {
    handleClickLayer();
  };

  // 레이어 드레그 도중 로직
  const handleGroupDragMove = throttle((e) => {
    const groupNode = groupRef.current;

    updateLayerState({
      width: groupNode.width(),
      height: groupNode.height(),
      x: Math.round(groupNode.x()),
      y: Math.round(groupNode.y()),
    });
  }, 200);

  // 레이어 크기 조정 로직
  const handleGroupTransform = throttle((e) => {
    const groupNode = groupRef.current;
    const layerWidth = Math.round(groupNode.width() * groupNode.scaleX());
    const layerHeight = Math.round(groupNode.height() * groupNode.scaleY());
    const layerX = Math.round(groupNode.x());
    const layerY = Math.round(groupNode.y());

    updateLayerState({
      width: layerWidth,
      height: layerHeight,
      x: layerX,
      y: layerY,
    });
  }, 200);

  return (
    <>
      <Group
        name="object"
        x={Number(layerProps.x)}
        y={Number(layerProps.y)}
        width={Number(layerProps.width)}
        height={Number(layerProps.height)}
        onClick={(e) => {
          e.cancelBubble = true;
          handleClickLayer();
        }}
        onDragStart={(e) => {
          e.cancelBubble = true;
          handleGroupDragStart(e);
        }}
        onDragMove={(e) => {
          e.cancelBubble = true;
          handleGroupDragMove(e);
        }}
        // onTransformStart={handleGroupTransformStart}
        onTransform={(e) => {
          e.cancelBubble = true;
          handleGroupTransform(e);
        }}
        dragBoundFunc={(pos) => pos}
      >
        <Rect
          width={Number(layerProps.width)}
          height={Number(layerProps.height)}
          fill={Konva.Util.getRandomColor()}
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          keepRatio={false}
          borderStroke="white"
          borderStrokeWidth={2}
          anchorStroke="white"
          anchorStrokeWidth={0}
          anchorSize={10}
          boundBoxFunc={handleBoundBoxFunc}
        />
      )}
    </>
  );
};

const LayerOffset = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 500px;
  height: 200px;
`;

export default React.memo(App);
