import { createGlobalStyle } from "styled-components";

import "modern-normalize/modern-normalize.css";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";

export const GlobalStyle = createGlobalStyle`
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
