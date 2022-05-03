import React, { useState } from "react";
import styled from "styled-components";
import { assertNonNull } from "../../util/Assert";
import { BackgroundLayer } from "../../util/BackgroundLayer";
import { CSSBackgroundImagePicker } from "./CSSBackgroundImagePicker";

export default {
  component: CSSBackgroundImagePicker,
};

const StyledPicker = styled(CSSBackgroundImagePicker)`
  width: 224px;
`;

const BackgroundPreview = styled.div`
  width: 128px;
  height: 128px;
`;

const Wrap = styled.div``;

export const Basic: React.FC = () => {
  const [bgLayer, setBgLayer] = useState<BackgroundLayer | undefined>(() =>
    assertNonNull(BackgroundLayer.fromString("url(https://picsum.photos/100)"))
  );

  return (
    <Wrap>
      <p>{bgLayer?.toCSSValue().toString() ?? "none"}</p>
      <BackgroundPreview
        style={{ background: bgLayer?.toCSSValue().toString() }}
      />
      <StyledPicker value={bgLayer} onChange={setBgLayer} />
    </Wrap>
  );
};
