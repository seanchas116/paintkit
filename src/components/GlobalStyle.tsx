import styled, { createGlobalStyle, css } from "styled-components";
import React from "react";
import { miniresetCSS, simpleBarCSS, tippyCSS } from "./LibraryCSS";
import { darkColorCSSVariables, lightColorCSSVariables } from "./Palette";

export const GlobalStyle = createGlobalStyle`
  // styles for libraries
  ${simpleBarCSS}
  ${tippyCSS}

  :where(.paintkit-root) {
    ${miniresetCSS}

    * {
      user-select: none;
      margin: 0;
      padding: 0;
      background: none;
      border: none;
      outline: none;
      appearance: none;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    .simplebar-content {
      height: 100%;
    }

    .tippy-box {
      font-size: 12px;
      white-space: nowrap;
    }

    [hidden] {
      display: none !important;
    }

    button:not(:disabled) {
      cursor: pointer;
    }
    button:disabled {
      cursor: not-allowed;
    }
  }
`;

export type ColorScheme = "auto" | "light" | "dark";

export const ColorSchemeProvider = styled.div<{
  colorScheme: ColorScheme;
}>`
  ${(p) =>
    p.colorScheme === "auto"
      ? css`
          ${lightColorCSSVariables};
          @media (prefers-color-scheme: dark) {
            ${darkColorCSSVariables}
          }
        `
      : p.colorScheme === "light"
      ? lightColorCSSVariables
      : darkColorCSSVariables}
`;

export const PaintkitProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="paintkit-root">
      <GlobalStyle />
      {children}
    </div>
  );
};
