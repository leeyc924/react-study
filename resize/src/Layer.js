import React, { useRef } from "react";
import { useCallback } from "react";
import styled from "styled-components";
import { css } from "styled-components";

const Layer = ({ layerProps, handleUpdateLayer }) => {
  const { layerId, x, y, width, height, backgroundColor } = layerProps;
  const minimum_size = useRef(20);
  const original_width = useRef(0);
  const original_height = useRef(0);
  const original_x = useRef(0);
  const original_y = useRef(0);
  const original_mouse_x = useRef(0);
  const original_mouse_y = useRef(0);
  const anchor_name = useRef("");

  const handleResize = useCallback(
    (e) => {
      console.log('anchor_name', anchor_name.current);
      if (anchor_name.current === "bottom-right") {
        const width =
          original_width.current + (e.pageX - original_mouse_x.current);
        const height =
          original_height.current + (e.pageY - original_mouse_y.current);
        if (width > minimum_size.current) {
          handleUpdateLayer({ layerId, updateInfo: { width } });
        }
        if (height > minimum_size.current) {
          handleUpdateLayer({ layerId, updateInfo: { height } });
        }
      } else if (anchor_name.current === "bottom-left") {
        const height =
          original_height.current + (e.pageY - original_mouse_y.current);
        const width =
          original_width.current - (e.pageX - original_mouse_x.current);
        if (height > minimum_size.current) {
          handleUpdateLayer({ layerId, updateInfo: { height } });
        }
        if (width > minimum_size.current) {
          handleUpdateLayer({
            layerId,
            updateInfo: {
              width,
              x: original_x + (e.pageX - original_mouse_x.current),
            },
          });
        }
      } else if (anchor_name.current === "top-right") {
        const width = original_x.current + (e.pageX - original_mouse_x.current);
        const height =
          original_height.current - (e.pageY - original_mouse_y.current);
        if (width > minimum_size.current) {
          handleUpdateLayer({
            layerId,
            updateInfo: {
              width,
            },
          });
        }
        if (height > minimum_size.current) {
          handleUpdateLayer({
            layerId,
            updateInfo: {
              height,
              y: original_y.current + (e.pageY - original_mouse_y.current),
            },
          });
        }
      } else if (anchor_name.current === "top-left") {
        const width = original_x.current - (e.pageX - original_mouse_x.current);
        const height =
          original_height.current - (e.pageY - original_mouse_y.current);
        if (width > minimum_size.current) {
          handleUpdateLayer({
            layerId,
            updateInfo: {
              width,
              x: original_x.current + (e.pageX - original_mouse_x.current),
            },
          });
        }
        if (height > minimum_size.current) {
          handleUpdateLayer({
            layerId,
            updateInfo: {
              height,
              y: original_y.current + (e.pageY - original_mouse_y.current),
            },
          });
        }
      }
    },
    [layerId, handleUpdateLayer]
  );

  const handleStopResize = useCallback(() => {
    console.log('mouseUp');
    window.removeEventListener("mousemove", handleResize);
  }, [handleResize]);

  const handleAnchor = useCallback(
    (e, anchorNm) => {
      console.log('mouseDown');
      e.preventDefault();
      original_width.current = width;
      original_height.current = height;
      original_x.current = x;
      original_y.current = y;
      original_mouse_x.current = e.pageX;
      original_mouse_y.current = e.pageY;
      anchor_name.current = anchorNm;
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", handleStopResize);
    },
    [handleResize, handleStopResize, width, height, x, y]
  );

  return (
    <LayerBox
      x={x}
      y={y}
      width={width}
      height={height}
      backgroundColor={backgroundColor}
    >
      <Wrap>
        <Anchor handleAnchor={handleAnchor} />
      </Wrap>
    </LayerBox>
  );
};

const Anchor = ({ handleAnchor }) => {
  return (
    <AnchorBox>
      <AnchorCircle
        className="top-left"
        onMouseDown={(e) => handleAnchor(e, "top-left")}
      />
      <AnchorCircle
        className="top-center"
        onMouseDown={(e) => handleAnchor(e, "top-center")}
      />
      <AnchorCircle
        className="top-right"
        onMouseDown={(e) => handleAnchor(e, "top-right")}
      />
      <AnchorCircle
        className="middle-right"
        onMouseDown={(e) => handleAnchor(e, "middle-right")}
      />
      <AnchorCircle
        className="middle-left"
        onMouseDown={(e) => handleAnchor(e, "middle-left")}
      />
      <AnchorCircle
        className="bottom-left"
        onMouseDown={(e) => handleAnchor(e, "bottom-left")}
      />
      <AnchorCircle
        className="bottom-center"
        onMouseDown={(e) => handleAnchor(e, "bottom-center")}
      />
      <AnchorCircle
        className="bottom-right"
        onMouseDown={(e) => handleAnchor(e, "bottom-right")}
      />
    </AnchorBox>
  );
};

const LayerBox = styled.div`
  position: absolute;
  ${({ x, y, width, height, backgroundColor }) => css`
    left: ${x}px;
    top: ${y}px;
    width: ${width}px;
    height: ${height}px;
    background-color: ${`rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`};
  `}
`;

const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const AnchorBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid #4286f4;
  box-sizing: border-box;
`;

const AnchorCircle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%; /*magic to turn square into circle*/
  background: white;
  border: 3px solid #4286f4;
  position: absolute;

  &.top-left {
    left: -8px;
    top: -8px;
    cursor: nwse-resize;
  }
  &.top-right {
    right: -8px;
    top: -8px;
    cursor: nesw-resize;
  }
  &.bottom-left {
    left: -8px;
    bottom: -8px;
    cursor: sw-resize;
  }
  &.bottom-right {
    right: -8px;
    bottom: -8px;
    cursor: se-resize;
  }
`;

export default React.memo(Layer);
