import React from "react";
import { addDecorator } from "@storybook/react";
import styled, { createGlobalStyle } from "styled-components";
import { PaintkitRoot } from "./PaintkitRoot";
import { colors } from "./Palette";
import { fontFamily } from "./Common";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0 !important;
    padding: 0 !important;
  }
  .tippy-content {
    font-family: ${fontFamily};
    font-size: 12px;
  }
`;

const GrayBackground = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 16px;
  font-size: 12px;
  color: ${colors.text};
  background-color: ${colors.background};
`;

addDecorator((s) => (
  <React.StrictMode>
    <PaintkitRoot colorScheme="auto">
      <GlobalStyle />
      <GrayBackground>{s()}</GrayBackground>
    </PaintkitRoot>
  </React.StrictMode>
));
