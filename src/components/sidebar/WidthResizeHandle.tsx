import React from "react";
import styled, { css } from "styled-components";
import { usePointerStroke } from "../hooks/usePointerStroke";

const WidthResizeHandleWrap = styled.div<{
  position: "left" | "right";
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  ${(p) =>
    p.position === "left"
      ? css`
          left: -4px;
        `
      : css`
          right: -4px;
        `}
  width: 8px;
  z-index: 100;
  cursor: col-resize;
`;

export const WidthResizeHandle: React.FC<{
  position: "left" | "right";
  width: number;
  onChangeWidth: (width: number) => void;
}> = ({ position, width, onChangeWidth }) => {
  const pointerProps = usePointerStroke<Element, number>({
    onBegin: (e) => {
      e.preventDefault();
      e.stopPropagation();
      return width;
    },
    onMove: (e, { totalDeltaX, initData }) => {
      e.preventDefault();
      e.stopPropagation();
      if (position === "left") {
        onChangeWidth(initData - totalDeltaX);
      } else {
        onChangeWidth(initData + totalDeltaX);
      }
    },
  });

  return <WidthResizeHandleWrap position={position} {...pointerProps} />;
};
