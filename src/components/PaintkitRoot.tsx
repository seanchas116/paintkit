import styled, { createGlobalStyle, css } from "styled-components";
import React from "react";
import { miniresetCSS, simpleBarCSS, tippyCSS } from "./LibraryCSS";
import { darkColorCSSVariables, lightColorCSSVariables } from "./Palette";
import { fontFamily } from "./Common";

const GlobalStyle = createGlobalStyle`
  // styles for libraries
  ${tippyCSS}

  :where(.paintkit-root) {
    ${simpleBarCSS}
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
      font-family: inherit;
    }

    .simplebar-content {
      height: 100%;
    }
    .simplebar-offset {
      width: 100%;
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

const PaintkitRootWrap = styled.div<{
  colorScheme: ColorScheme;
  lightSelector?: string;
  darkSelector?: string;
}>`
  display: contents;
  font-family: ${fontFamily};

  ${(p) =>
    p.colorScheme === "auto"
      ? css`
          ${lightColorCSSVariables};
          @media (prefers-color-scheme: dark) {
            ${darkColorCSSVariables}
          }
          ${p.lightSelector &&
          css`
            ${p.lightSelector} {
              ${lightColorCSSVariables}
            }
          `}
          ${p.darkSelector &&
          css`
            ${p.darkSelector} {
              ${darkColorCSSVariables}
            }
          `}
        `
      : p.colorScheme === "light"
      ? lightColorCSSVariables
      : darkColorCSSVariables}
`;

export const PaintkitRoot: React.FC<{
  children: React.ReactNode;
  colorScheme: ColorScheme;
  lightSelector?: string;
  darkSelector?: string;
}> = ({ children, colorScheme, lightSelector, darkSelector }) => {
  return (
    <>
      <GlobalStyle />
      <PaintkitRootWrap
        className="paintkit-root"
        colorScheme={colorScheme}
        lightSelector={lightSelector}
        darkSelector={darkSelector}
      >
        {children}
      </PaintkitRootWrap>
    </>
  );
};
