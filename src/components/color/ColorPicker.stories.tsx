import React, { useState } from "react";
import { SketchPicker } from "react-color";
import styled from "styled-components";
import { Color } from "../../util/Color";
import { ColorPicker } from "./ColorPicker";

export default {
  title: "ColorPicker",
  component: ColorPicker,
};

const Wrap = styled.div`
  > * {
    margin-bottom: 32px;
  }
`;

export const Basic: React.FC = () => {
  const [color, setColor] = useState(() => Color.fromName("purple"));
  return (
    <Wrap>
      <SketchPicker
        color={color.toHex()}
        onChange={(change) => {
          const { hsl } = change;
          setColor(
            Color.hsl({
              h: hsl.h / 360,
              s: hsl.s,
              l: hsl.l,
              a: hsl.a ?? 1,
            })
          );
        }}
      />
      <ColorPicker
        color={color}
        onChange={setColor}
        onChangeEnd={(color) => {
          console.log("change end", color);
          setColor(color);
        }}
      />
    </Wrap>
  );
};
