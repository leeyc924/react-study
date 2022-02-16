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
  Group,
  Transformer,
} from "react-konva";
import Konva from "konva";

const App = () => {
  const [ratio, setRatio] = useState(1);
  const [degreeIndex, setDegreeIndex] = useState(0);
  const horizonResolution = degreeIndex % 2 === 0? 1000 : 500;
  const verticalResolution = degreeIndex % 2 === 0? 500 : 1000;
  const degree = [0, 90, 180, 270];

  const [layerList, setLayerList] = useState([
    {
      layerId: "1",
      x: 0,
      y: 0,
      width: 500,
      height: 250,
      color: Konva.Util.getRandomColor(),
    },
    {
      layerId: "2",
      x: 500,
      y: 0,
      width: 500,
      height: 250,
      color: Konva.Util.getRandomColor(),
    },
    {
      layerId: "3",
      x: 0,
      y: 250,
      width: 500,
      height: 250,
      color: Konva.Util.getRandomColor(),
    },
    {
      layerId: "4",
      x: 500,
      y: 250,
      width: 500,
      height: 250,
      color: Konva.Util.getRandomColor(),
    },
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState("");

  // 브라우저 비율에 맞는 가로 해상도
  const ratioHorizon = useMemo(
    () => Math.round(ratio * Number(horizonResolution)),
    [ratio, horizonResolution]
  );
  // 브라우저 비율에 맞는 세로 해상도
  const ratioVertical = useMemo(
    () => Math.round(ratio * Number(verticalResolution)),
    [ratio, verticalResolution]
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
  }, [horizonResolution, verticalResolution]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const handleClickLayer = useCallback((layerId) => {
    setSelectedLayerId(String(layerId));
  }, []);

  const updateLayerState = useCallback(
    (updateInfo) => {
      setLayerList((layerList) =>
        layerList.map((layer) =>
          layer.layerId === selectedLayerId
            ? { ...layer, ...updateInfo }
            : { ...layer }
        )
      );
    },
    [selectedLayerId]
  );

  const selectedLayer = useMemo(() => {
    return layerList.find((layer) => layer.layerId === selectedLayerId);
  }, [layerList, selectedLayerId]);

  console.log("degree[degreeIndex]", degree[degreeIndex]);
  return (
    <>
      {selectedLayer && (
        <LayerOffset>
          <div>
            <span>x: {selectedLayer.x}</span>
            <span>y: {selectedLayer.y}</span>
          </div>
          <div>
            <span>w: {selectedLayer.width}</span>
            <span>h: {selectedLayer.height}</span>
          </div>
        </LayerOffset>
      )}
      <Button
        onClick={() =>
          setDegreeIndex((degreeIndex) =>
            degreeIndex > 2 ? 0 : degreeIndex + 1
          )
        }
      >
        회전
      </Button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={ratio}
        scaleY={ratio}
      >
        <KonvaLayer
          x={playerAreaInfo.x + horizonResolution / 2}
          y={playerAreaInfo.y + verticalResolution / 2}
          scaleX={1}
          scaleY={1}
          offsetX={horizonResolution / 2}
          offsetY={verticalResolution / 2}
          rotation={degree[degreeIndex]}
        >
          <Rect
            width={playerAreaInfo.width}
            height={playerAreaInfo.height}
            fill="black"
          />
          {layerList.map((layer) => (
            <Layer
              key={layer.layerId}
              layerProps={layer}
              updateLayerState={updateLayerState}
              handleClickLayer={() => handleClickLayer(layer.layerId)}
              isSelected={selectedLayerId === layer.layerId}
            />
          ))}
        </KonvaLayer>
      </Stage>
    </>
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

  useEffect(() => {
    if (isSelected) {
      // trRef.current.nodes([rectRef.current, textRef.current]); // 아래와 같이 그룹 하나에만 붙이면 각각의 노드에 대해 이벤트가 안먹힘
      trRef.current.nodes([groupRef.current]); // 트랜스폼 기능은 그룹 하나로만 관리하는것이 이슈 관리에 용이함
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, updateLayerState]);

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
    handleClickLayer(layerProps.layerId);
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

  // 레이어 크기 조정 끝날때 로직
  const handleGroupTransformEnd = (e) => {
    const groupNode = groupRef.current;
    const layerWidth = Math.max(
      Math.round(groupNode.width() * groupNode.scaleX()),
      20
    );
    const layerHeight = Math.max(
      Math.round(groupNode.height() * groupNode.scaleY()),
      20
    );
    const layerX = Math.round(groupNode.x());
    const layerY = Math.round(groupNode.y());
    // 스케일 재설정; (저장소에는 데이터와 일치하는 높이와 너비만 들어있음)
    groupNode.scaleX(1);
    groupNode.scaleY(1);

    updateLayerState({
      width: layerWidth,
      height: layerHeight,
      x: layerX,
      y: layerY,
    });
  };

  return (
    <>
      <Group
        ref={groupRef}
        id={layerProps.layerId}
        name="object"
        x={Number(layerProps.x)}
        y={Number(layerProps.y)}
        width={Number(layerProps.width)}
        height={Number(layerProps.height)}
        draggable={true}
        onClick={(e) => {
          e.cancelBubble = true;
          handleClickLayer(layerProps.layerId);
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
        onTransformEnd={(e) => {
          e.cancelBubble = true;
          handleGroupTransformEnd(e);
        }}
        dragBoundFunc={(pos) => pos}
      >
        <Rect
          width={Number(layerProps.width)}
          height={Number(layerProps.height)}
          fill={layerProps.color}
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          resizeEnabled={true}
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
  width: 150px;
  height: 50px;
  display: flex;
  flex-direction: column;

  & div {
    width: 100%;
    display: flex;
    flex: 1;
    & > span {
      display: flex;
      align-items: center;
      flex: 1;
    }
  }
`;

const Button = styled.button`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1;
`;

export default React.memo(App);
