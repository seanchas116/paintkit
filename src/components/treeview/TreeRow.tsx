import { Icon } from "@iconify/react/dist/offline";
import styled, { css } from "styled-components";
import { ClickToEditInput } from "../ClickToEditInput";
import { textTruncate } from "../Common";
import { colors } from "../Palette";

export const TreeRowLabel = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${colors.text};
  ${textTruncate};
`;

export const TreeRowNameEdit = styled(ClickToEditInput)`
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  font-weight: 400;
  width: 0;
  color: ${colors.text};
`;

export const TreeRowIcon = styled(Icon).attrs({ width: 12, height: 12 })`
  margin-right: 8px;
  color: ${colors.icon};
`;

export const TreeRow = styled.div<{ inverted: boolean }>`
  min-width: 0;
  height: 24px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 12px;
  line-height: 12px;

  ${TreeRowLabel}, ${TreeRowNameEdit} {
    flex: 1;
  }

  ${(p) =>
    p.inverted &&
    css`
      ${TreeRowNameEdit}, ${TreeRowIcon} {
        color: white;
      }
    `}
`;
