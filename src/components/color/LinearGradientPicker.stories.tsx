import React, { useState } from "react";
import styled from "styled-components";
import { LinearGradient } from "../../util/Gradient";
import { LinearGradientPicker } from "./LinearGradientPicker";

export default {
  component: LinearGradientPicker,
};

const StyledPicker = styled(LinearGradientPicker)`
  width: fit-content;
`;

const GradientPreview = styled.div`
  width: 64px;
  height: 64px;
`;

const Wrap = styled.div`
  > * {
    margin-bottom: 32px;
  }
`;

export const Basic: React.FC = () => {
  const [gradient, setGradient] = useState(() =>
    LinearGradient.fromString("linear-gradient(white, red)")
  );
  const [index, setIndex] = useState(0);

  return (
    <Wrap>
      <p>{gradient.toString()}</p>
      <GradientPreview style={{ background: gradient.toString() }} />
      <StyledPicker
        value={gradient}
        onChange={setGradient}
        onChangeEnd={() => {
          console.log("change end");
        }}
        index={index}
        onIndexChange={setIndex}
      />
    </Wrap>
  );
};
