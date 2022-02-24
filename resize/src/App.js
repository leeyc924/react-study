import React, { useState } from "react";
import { useCallback } from "react";
import styled from "styled-components";
import Layer from "./Layer";

import transparencyBg from "./main-transparency-bg.svg";

const App = () => {
  const [layerList, setLayerList] = useState([
    {
      layerId: 0,
      width: 200,
      height: 200,
      x: 720,
      y: 454,
      backgroundColor: { r: 255, g: 255, b: 255, a: 1 },
    },
    {
      layerId: 1,
      width: 200,
      height: 200,
      x: 600,
      y: 560,
      backgroundColor: { r: 123, g: 255, b: 255, a: 1 },
    },
    {
      layerId: 2,
      width: 200,
      height: 200,
      x: 788,
      y: 20,
      backgroundColor: { r: 255, g: 126, b: 235, a: 1 },
    },
    {
      layerId: 3,
      width: 200,
      height: 200,
      x: 237,
      y: 450,
      backgroundColor: { r: 155, g: 155, b: 255, a: 1 },
    },
    {
      layerId: 4,
      width: 200,
      height: 200,
      x: 26,
      y: 470,
      backgroundColor: { r: 5, g: 200, b: 85, a: 1 },
    },
    {
      layerId: 5,
      width: 200,
      height: 200,
      x: 223,
      y: 89,
      backgroundColor: { r: 25, g: 25, b: 55, a: 1 },
    },
    {
      layerId: 6,
      width: 200,
      height: 200,
      x: 0,
      y: 330,
      backgroundColor: { r: 18, g: 93, b: 45, a: 1 },
    },
    {
      layerId: 7,
      width: 200,
      height: 200,
      x: 266,
      y: 30,
      backgroundColor: { r: 64, g: 23, b: 45, a: 1 },
    },
    {
      layerId: 8,
      width: 200,
      height: 200,
      x: 0,
      y: 70,
      backgroundColor: { r: 71, g: 132, b: 172, a: 1 },
    },
    {
      layerId: 9,
      width: 200,
      height: 200,
      x: 580,
      y: 220,
      backgroundColor: { r: 32, g: 45, b: 78, a: 1 },
    },
  ]);

  const handleUpdateLayer = useCallback(({ layerId, updateInfo }) => {
    console.log('aaa');
    setLayerList((layerList) =>
      layerList.map((layer) =>
        layer.layerId === layerId ? { ...layer, ...updateInfo } : layer
      )
    );
  }, []);

  return (
    <Component>
      {layerList.map((layer) => (
        <Layer key={layer.layerId} layerProps={layer} handleUpdateLayer={handleUpdateLayer} />
      ))}
    </Component>
  );
};

const Component = styled.div`
  position: relative;
  width: 1000px;
  height: 1000px;
  background-image: url(${transparencyBg});
  background-repeat: repeat;
`;

export default React.memo(App);
