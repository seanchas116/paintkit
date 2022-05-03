import React, { useState } from "react";
import styled from "styled-components";
import { assertNonNull } from "../../util/Assert";
import { BackgroundLayer } from "../../util/BackgroundLayer";
import { BackgroundImagePicker } from "./BackgroundImagePicker";

export default {
  component: BackgroundImagePicker,
};

const StyledBackgroundImagePopover = styled(BackgroundImagePicker)`
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
      <StyledBackgroundImagePopover value={bgLayer} onChange={setBgLayer} />
    </Wrap>
  );
};
