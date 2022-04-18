import React, { useState } from "react";
import styled from "styled-components";
import { DimensionInput, DimensionInputValue } from "./DimensionInput";

export default {
  title: "DimensionInput",
  component: DimensionInput,
};

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 72px 100px;
  align-items: center;
  gap: 8px;
`;

export const Basic: React.FC = () => {
  const [value0, setValue0] = useState<DimensionInputValue | undefined>({
    value: 100,
    unit: "px",
  });

  return (
    <>
      <Wrap>
        <DimensionInput
          value={value0}
          label="W"
          units={["px", "em", "rem", "vw", "vh"]}
          keywords={["auto", "inherit"]}
          onChange={(value) => {
            setValue0(value);
            return true;
          }}
        />
        <div>{JSON.stringify(value0)}</div>
      </Wrap>
    </>
  );
};
