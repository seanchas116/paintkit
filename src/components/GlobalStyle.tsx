import { createGlobalStyle } from "styled-components";

import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";
import React from "react";

export const GlobalStyle = createGlobalStyle`
  :where(.paintkit-provider) {
    /*! minireset.css v0.0.6 | MIT License | github.com/jgthms/minireset.css */
    html,
    body,
    p,
    ol,
    ul,
    li,
    dl,
    dt,
    dd,
    blockquote,
    figure,
    fieldset,
    legend,
    textarea,
    pre,
    iframe,
    hr,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0;
      padding: 0;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-size: 100%;
      font-weight: normal;
    }

    ul {
      list-style: none;
    }

    button,
    input,
    select {
      margin: 0;
    }

    html {
      box-sizing: border-box;
    }

    *, *::before, *::after {
      box-sizing: inherit;
    }

    img,
    video {
      height: auto;
      max-width: 100%;
    }

    iframe {
      border: 0;
    }

    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    td,
    th {
      padding: 0;
    }

    /* end of minireset */

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
