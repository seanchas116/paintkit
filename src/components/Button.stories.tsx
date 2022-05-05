import React from "react";
import styled from "styled-components";
import { Button } from "./Button";

export default {
  component: Button,
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Basic: React.FC = () => {
  return (
    <Wrap>
      <Button>Button</Button>
      <Button disabled>Button</Button>
      <Button primary>Button</Button>
    </Wrap>
  );
};
