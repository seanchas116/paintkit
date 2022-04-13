import React, { useState } from "react";
import styled from "styled-components";
import htmlTags from "html-tags";
import { SuggestedInput } from "./SuggestedInput";

export default {
  title: "SuggestedInput",
  component: SuggestedInput,
};

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 100px 100px;
  align-items: center;
  gap: 8px;
`;

export const Basic: React.FC = () => {
  const [value, setValue] = useState("");

  return (
    <>
      <Wrap>
        <SuggestedInput
          placeholder="HTML Tag"
          value={value}
          onChange={(value) => {
            setValue(value);
            return true;
          }}
          suggestionOptions={htmlTags.map((t) => ({ value: t }))}
        />
        <div>{value}</div>
      </Wrap>
    </>
  );
};
