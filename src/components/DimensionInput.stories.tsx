import React, { useState } from "react";
import styled from "styled-components";
import marginLeftIcon from "../icon/MarginLeft";
import { DimensionInput } from "./DimensionInput";

export default {
  component: DimensionInput,
};

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 72px 100px;
  align-items: center;
  gap: 8px;
`;

export const Basic: React.FC = () => {
  const [width, setWidth] = useState<string | undefined>("100px");
  const [margin, setMargin] = useState<string | undefined>("100px");

  return (
    <>
      <Wrap>
        <DimensionInput
          value={width}
          label="W"
          title="Width"
          units={["px", "em", "rem", "vw", "vh"]}
          keywords={["auto", "inherit"]}
          onChange={(value) => {
            setWidth(value);
            return true;
          }}
        />
        <div>{width}</div>
        <DimensionInput
          value={margin}
          icon={marginLeftIcon}
          title="Margin Left"
          units={["px", "em", "rem", "vw", "vh"]}
          keywords={["auto", "inherit"]}
          onChange={(value) => {
            setMargin(value);
            return true;
          }}
        />
        <div>{margin}</div>
      </Wrap>
    </>
  );
};
