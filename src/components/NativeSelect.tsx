import React from "react";
import styled from "styled-components";
import keyboardArrowDownIcon from "@iconify-icons/ic/outline-keyboard-arrow-down";
import { iconToDataURL } from "@seanchas116/paintkit/src/util/Image";
import { colors } from "./Palette";

const keyboardArrowDownIconURL = iconToDataURL(keyboardArrowDownIcon);

const Select = styled.select`
  display: block;
  width: 100%;
  height: 100%;

  font-size: 12px;
  color: ${colors.text};
  line-height: 24px;

  cursor: pointer;
`;

export const NativeSelectWrap = styled.div`
  height: 24px;
  position: relative;
  background-color: ${colors.uiBackground};
  border-radius: 4px;

  padding: 0 6px;

  :focus-within {
    box-shadow: 0 0 0 1px inset ${colors.active};
  }

  ::after {
    content: "";
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    height: 24px;
    mask-size: 12px;
    mask-position: center;
    mask-image: url(${keyboardArrowDownIconURL});
    mask-repeat: no-repeat;
    background-color: currentColor;
    color: ${colors.icon};
  }
`;

export const NativeSelect: React.VFC<{
  children?: React.ReactNode;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}> = ({ children, className, value, onChange }) => {
  return (
    <NativeSelectWrap className={className}>
      <Select value={value} onChange={(e) => onChange?.(e.currentTarget.value)}>
        {children}
      </Select>
    </NativeSelectWrap>
  );
};
