import React, { useState } from "react";
import styled from "styled-components";
import { TextRadio } from "./TextRadio";

export default {
  title: "TextRadio",
  component: TextRadio,
};

const StyledTextRadio = styled(TextRadio)`
  width: 320px;
`;

export const Basic: React.FC = () => {
  const [value, setValue] = useState<string | undefined>();

  const options = [
    {
      value: "left",
      text: "Left",
    },
    {
      value: "center",
      text: "Center",
    },
    {
      value: "right",
      text: "Right",
    },
  ];

  return (
    <StyledTextRadio
      options={options}
      value={value}
      placeholder="left"
      onChange={setValue}
    />
  );
};
