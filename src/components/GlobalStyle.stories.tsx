import React from "react";
import { addDecorator } from "@storybook/react";
import styled, { createGlobalStyle } from "styled-components";
import { ColorSchemeProvider, PaintkitProvider } from "./GlobalStyle";
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
    <ColorSchemeProvider colorScheme="auto">
      <GlobalStyle />
      <PaintkitProvider>
        <GrayBackground>{s()}</GrayBackground>
      </PaintkitProvider>
    </ColorSchemeProvider>
  </React.StrictMode>
));
