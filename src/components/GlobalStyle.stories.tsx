import React from "react";
import { addDecorator } from "@storybook/react";
import { createGlobalStyle } from "styled-components";
import { ColorSchemeProvider, PaintkitProvider } from "./GlobalStyle";
import { colors } from "./Palette";

const GrayBackground = createGlobalStyle`
  body {
    font-size: 12px;
    color: ${colors.text};
    background-color: ${colors.background};
  }
`;

addDecorator((s) => (
  <ColorSchemeProvider colorScheme="auto">
    <PaintkitProvider>
      <GrayBackground />
      {s()}
    </PaintkitProvider>
  </ColorSchemeProvider>
));
