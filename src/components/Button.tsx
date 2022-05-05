import styled, { css } from "styled-components";
import { colors } from "./Palette";

export const Button = styled.button.attrs({ type: "button" })<{
  primary?: boolean;
}>`
  width: fit-content;
  height: 24px;
  border-radius: 4px;
  padding-left: 8px;
  padding-right: 8px;
  line-height: 16px;
  font-size: 12px;
  background-color: ${colors.uiBackground};
  border: none;
  cursor: pointer;
  color: ${colors.text};
  display: flex;
  align-items: center;
  gap: 4px;

  :not(:disabled):hover {
    background: ${colors.popoverBorder};
  }

  ${({ primary }) =>
    primary &&
    css`
      color: ${colors.activeText};

      background-color: ${colors.active};
      :not(:disabled):hover {
        background: linear-gradient(
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.1) 100%
          ),
          ${colors.active};
      }
    `}
`;
