import React from "react";
import { addDecorator } from "@storybook/react";
import { createGlobalStyle } from "styled-components";
import { PaintkitProvider } from "./GlobalStyle";
import { colors, ColorsGlobalStyle } from "./Palette";

const GrayBackground = createGlobalStyle`
  body {
    font-size: 12px;
    color: ${colors.text};
    background-color: ${colors.background};
  }
`;

addDecorator((s) => (
  <>
    <ColorsGlobalStyle scheme="auto" />
    <GrayBackground />
    <PaintkitProvider>{s()}</PaintkitProvider>
  </>
));
