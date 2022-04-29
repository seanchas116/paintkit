import React, { useState } from "react";
import styled from "styled-components";
import { Color } from "../../util/Color";
import { ColorInput } from "./ColorInput";

export default {
  component: ColorInput,
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
      <ColorInput
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