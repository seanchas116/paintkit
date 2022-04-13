import React, { useState } from "react";
import htmlTags from "html-tags";
import styled from "styled-components";
import { NativeComboBox } from "./NativeComboBox";

export default {
  title: "NativeComboBox",
  component: NativeComboBox,
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledComboBox = styled(NativeComboBox)`
  width: 100px;
`;

export const Basic: React.FC = () => {
  const [value, setValue] = useState("div");

  return (
    <Wrap>
      <StyledComboBox value={value} onChange={setValue}>
        {htmlTags.map((t) => (
          <option value={t} key={t}>
            {t}
          </option>
        ))}
      </StyledComboBox>
      <div>{value}</div>
    </Wrap>
  );
};
