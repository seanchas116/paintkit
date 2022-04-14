import styled, { css } from "styled-components";
import { colors } from "../Palette";

export const InspectorTabBar = styled.div`
  height: 34px;
  padding: 0 8px;
  display: flex;
  border-bottom: 2px solid ${colors.separator};
`;

export const InspectorTabBarItem = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  height: 34px;
  font-size: 12px;
  font-weight: 600;
  line-height: 32px;
  color: ${colors.disabledText};
  text-align: center;
  padding: 0 8px;
  position: relative;

  ${(p) =>
    p["aria-selected"] &&
    css`
      ::after {
        content: "";
        position: absolute;
        display: block;
        left: 2px;
        right: 2px;
        bottom: 0;
        height: 2px;
        background-color: ${colors.active};
        border-radius: 1px;
      }

      color: ${colors.text};
    `}

  :hover {
    color: ${colors.text};
  }
`;
