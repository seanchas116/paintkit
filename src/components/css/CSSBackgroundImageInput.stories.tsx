import React, { useState } from "react";
import styled from "styled-components";
import { CSSBackgroundImageInput } from "./CSSBackgroundImageInput";

export default {
  component: CSSBackgroundImageInput,
};

const StyledBackgroundImageInput = styled(CSSBackgroundImageInput)`
  width: 224px;
`;

const BackgroundPreview = styled.div`
  width: 128px;
  height: 128px;
`;

const Wrap = styled.div``;

export const Basic: React.FC = () => {
  const [bgLayer, setBgLayer] = useState<string | undefined>(
    "url(https://picsum.photos/100)"
  );

  return (
    <Wrap>
      <p>{bgLayer}</p>
      <BackgroundPreview style={{ background: bgLayer }} />
      <StyledBackgroundImageInput value={bgLayer} onChange={setBgLayer} />
    </Wrap>
  );
};
