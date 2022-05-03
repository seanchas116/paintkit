import React, { useState } from "react";
import styled from "styled-components";
import { assertNonNull } from "../../util/Assert";
import { BackgroundLayer } from "../../util/BackgroundLayer";
import { NormalBackgroundImagePicker } from "./NormalBackgroundImagePicker";

export default {
  component: NormalBackgroundImagePicker,
};

const StyledPicker = styled(NormalBackgroundImagePicker)`
  width: 224px;
`;

const BackgroundPreview = styled.div`
  width: 128px;
  height: 128px;
`;

const Wrap = styled.div``;

export const Basic: React.FC = () => {
  const [bgLayer, setBgLayer] = useState(() =>
    assertNonNull(BackgroundLayer.fromString("url(https://picsum.photos/100)"))
  );

  return (
    <Wrap>
      <p>{bgLayer?.toCSSValue().toString()}</p>
      <BackgroundPreview
        style={{ background: bgLayer?.toCSSValue().toString() }}
      />
      <StyledPicker value={bgLayer} onChange={setBgLayer} />
    </Wrap>
  );
};
