import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import checkIcon from "@iconify-icons/ic/outline-check";
import keyboardArrowDownIcon from "@iconify-icons/ic/outline-keyboard-arrow-down";
import { iconToDataURL } from "../util/Image";
import { colors } from "./Palette";

const checkIconURL = iconToDataURL(checkIcon);
const keyboardArrowDownIconURL = iconToDataURL(keyboardArrowDownIcon);

export const inputStyle = css`
  border: none;
  outline: none;

  height: 24px;
  border-radius: 4px;
  padding: 0 6px;

  color: ${colors.text};
  font-size: 12px;
  line-height: 20px;
  vertical-align: middle;

  background-color: ${colors.uiBackground};

  --border-color: ${colors.active};
  :focus,
  :focus-within {
    box-shadow: 0 0 0 1px inset var(--border-color);
  }
  ::placeholder {
    color: ${colors.disabledText};
  }
`;

export const popoverZIndex = "100";

export const popoverStyle = css`
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15),
    0px 24px 30px rgba(0, 0, 0, 0.35), 0 0 0 1px ${colors.popoverBorder} inset;
  background-color: ${colors.background};
  border-radius: 4px;
  overflow: hidden;
`;

export const PopoverBody = styled.div`
  ${popoverStyle}
  position: relative;
`;

export function checkPattern(
  color0: string,
  color1: string,
  size: string,
  offsetX = "0px",
  offsetY = "0px"
): FlattenSimpleInterpolation {
  return css`
    background-color: ${color0};
    background-image: linear-gradient(
        45deg,
        ${color1} 25%,
        transparent 25%,
        transparent 75%,
        ${color1} 75%,
        ${color1}
      ),
      linear-gradient(
        45deg,
        ${color1} 25%,
        transparent 25%,
        transparent 75%,
        ${color1} 75%,
        ${color1}
      );
    background-position: ${offsetX} ${offsetY},
      calc(${size} / 2 + ${offsetX}) calc(${size} / 2 + ${offsetY});
    background-size: ${size} ${size};
  `;
}

export const RadioWrapBase = styled.div`
  background: ${colors.uiBackground};
  border-radius: 4px;
  padding: 2px;
`;

export const RadioItemBase = styled.button<{
  checked?: boolean;
  checkedAsPlaceholder?: boolean;
}>`
  border: none;
  padding: 0;
  height: 20px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: normal;

  color: ${(p) =>
    p.checked || p.checkedAsPlaceholder ? colors.activeText : colors.text};
  background: ${(p) =>
    p.checked
      ? colors.active
      : p.checkedAsPlaceholder
      ? colors.uiBackground
      : "none"};
`;

export const textTruncate = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DropdownBody = styled.div`
  z-index: ${popoverZIndex};
  ${popoverStyle}
`;

export const DropdownItem = styled.div<{ selected?: boolean }>`
  height: 24px;

  padding-left: 8px;
  padding-right: 8px;
  content-visibility: auto;

  font-size: 12px;
  line-height: 24px;
  color: ${colors.text};
  ${textTruncate}

  display: flex;
  align-items: center;
  gap: 4px;

  ${(p) =>
    p.selected &&
    css`
      background: ${colors.active};
      color: ${colors.activeText};
    `}
`;

export const DropdownCheck = styled.div<{ visible?: boolean }>`
  width: 8px;
  height: 8px;
  min-width: 8px;
  mask-size: contain;
  mask-image: url(${checkIconURL});
  background-color: currentColor;
  visibility: ${(p) => (p.visible ? "visible" : "hidden")};
`;

export const DropdownImageThumbnail = styled.img`
  width: 14px;
  height: 14px;
  min-width: 14px;
  border-radius: 2px;
  ${checkPattern("white", "#eee", "4px")}
`;

export const DropdownHeader = styled.div`
  height: 20px;
  line-height: 20px;
  padding-left: 8px;
  padding-right: 8px;
  ${textTruncate}
  color: ${colors.disabledText};
  font-size: 11px;
  font-weight: 600;
`;

export const DropdownWrap = styled.div`
  position: relative;
  ${DropdownBody} {
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
  }
`;

export const downIconStyle = css`
  width: 12px;
  height: 12px;
  mask-size: 12px;
  mask-position: center;
  mask-image: url(${keyboardArrowDownIconURL});
  mask-repeat: no-repeat;
  background-color: currentColor;
  color: ${colors.icon};
`;
