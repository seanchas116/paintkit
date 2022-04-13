import { createGlobalStyle } from "styled-components";

import "modern-normalize/modern-normalize.css";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";

export const GlobalStyle = createGlobalStyle`
  * {
    // TODO: make togglable via config?
    /* @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
      -webkit-font-smoothing: antialiased;
    } */

    user-select: none;
    margin: 0;
    padding: 0;
    background: none;
    border: none;
    outline: none;
    appearance: none;
    /* font: inherit; */
  }

  // Unset modern-normalize defaults
  img {
    max-width: unset;
    max-height: unset;
  }
  strong {
    font-weight: revert;
  }

  [hidden] {
    display: none !important;
  }

  .simplebar-content {
    height: 100%;
  }

  .tippy-box {
    font-size: 12px;
    white-space: nowrap;
  }

  button:not(:disabled) {
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
  }
`;
