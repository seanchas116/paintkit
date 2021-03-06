import React, { useState } from "react";
import styled from "styled-components";
import { CSSColorInput } from "./CSSColorInput";

export default {
  component: CSSColorInput,
};

const Wrap = styled.div`
  > * {
    margin-bottom: 32px;
  }
`;

export const Basic: React.FC = () => {
  const [color, setColor] = useState<string | undefined>(() => "purple");
  return (
    <Wrap>
      <CSSColorInput
        value={color}
        onChange={setColor}
        onChangeEnd={() => {
          console.log("change end");
        }}
      />
    </Wrap>
  );
};
