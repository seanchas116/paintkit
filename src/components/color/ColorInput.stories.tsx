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
  const [color, setColor] = useState<Color | undefined>(() =>
    Color.fromName("purple")
  );
  return (
    <Wrap>
      <ColorInput
        color={color}
        text={color?.toString()}
        onChangeColor={setColor}
        onChangeEndColor={(color) => {
          console.log("change end", color);
          setColor(color);
        }}
        onChangeText={(text) => {
          try {
            setColor(Color.from(text));
            return true;
          } catch (e) {
            console.error(e);
            return false;
          }
        }}
      />
    </Wrap>
  );
};
