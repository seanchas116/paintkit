import React, { useState } from "react";
import { Vec2 } from "paintvec";
import styled from "styled-components";
import { ResizeBox } from "./ResizeBox";

export default {
  title: "ResizeBox",
  component: ResizeBox,
};

const SVG = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export const Basic: React.FC = () => {
  const [p0, setP0] = useState(new Vec2(100));
  const [p1, setP1] = useState(new Vec2(300));

  return (
    <SVG>
      <ResizeBox
        p0={p0}
        p1={p1}
        snap={(p) => p}
        onChangeBegin={() => {}}
        onChange={(p0, p1) => {
          setP0(p0);
          setP1(p1);
        }}
        onChangeEnd={() => {}}
      />
    </SVG>
  );
};
