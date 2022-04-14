import { createGlobalStyle } from "styled-components";
import React from "react";
import { minireset, simpleBar, tippy } from "./LibraryCSS";

export const GlobalStyle = createGlobalStyle`
  // styles for libraries
  ${simpleBar}
  ${tippy}

  :where(.paintkit-provider) {
    ${minireset}

    * {
      user-select: none;
      margin: 0;
      padding: 0;
      background: none;
      border: none;
      outline: none;
      appearance: none;
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

export const PaintkitProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="paintkit-provider">
      <GlobalStyle />
      {children}
    </div>
  );
};
