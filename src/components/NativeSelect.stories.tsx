import React, { useState } from "react";
import htmlTags from "html-tags";
import styled from "styled-components";
import { NativeSelect } from "./NativeSelect";

export default {
  title: "NativeSelect",
  component: NativeSelect,
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledSelect = styled(NativeSelect)`
  width: 100px;
`;

export const Basic: React.FC = () => {
  const [value, setValue] = useState("div");

  return (
    <Wrap>
      <StyledSelect value={value} onChange={setValue}>
        {htmlTags.map((t) => (
          <option value={t} key={t}>
            {t}
          </option>
        ))}
      </StyledSelect>
      <div>{value}</div>
    </Wrap>
  );
};
