import React, { useState } from "react";
import htmlTags from "html-tags";
import styled from "styled-components";
import { ComboBox } from "./ComboBox";

export default {
  component: ComboBox,
};

const StyledComboBox = styled(ComboBox)`
  width: 100px;
`;

export const Basic: React.FC = () => {
  const [value, setValue] = useState("div");

  return (
    <>
      <StyledComboBox
        options={htmlTags.map((t) => ({ value: t }))}
        value={value}
        onChange={(value) => {
          setValue(value);
          return true;
        }}
      />
      <div>{value}</div>
    </>
  );
};
