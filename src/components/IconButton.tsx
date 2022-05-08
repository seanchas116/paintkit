import styled from "styled-components";
import addIcon from "@iconify-icons/ic/outline-add";
import removeIcon from "@iconify-icons/ic/outline-remove";
import refreshIcon from "@iconify-icons/ic/outline-refresh";
import moreHorizIcon from "@iconify-icons/ic/outline-more-horiz";
import { IconifyIcon } from "@iconify/types";
import React from "react";
import { Icon } from "@iconify/react/dist/offline";
import { colors } from "./Palette";

const IconButtonWrap = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  border-radius: 4px;

  width: 20px;
  height: 20px;
  color: ${colors.icon};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled):not([aria-pressed]) {
    color: ${colors.text};
  }
  &:disabled {
    color: ${colors.disabledText};
    cursor: not-allowed;
  }

  &:active {
    transform: scale(0.9);
  }

  &[aria-pressed="true"] {
    background-color: ${colors.active};
  }
`;

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconifyIcon;
  iconSize?: number;
  pressed?: boolean;
};

export const IconButton: React.FC<IconButtonProps> = React.memo(
  React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, iconSize = 16, pressed, ...props }, ref) => (
      <IconButtonWrap ref={ref} {...props} aria-pressed={pressed}>
        <Icon icon={icon} width={iconSize} height={iconSize} />
      </IconButtonWrap>
    )
  )
);

export const MoreButton = styled(IconButton).attrs({ icon: moreHorizIcon })``;
export const PlusButton = styled(IconButton).attrs({ icon: addIcon })``;
export const MinusButton = styled(IconButton).attrs({ icon: removeIcon })``;
export const ResetButton = styled(IconButton).attrs({ icon: refreshIcon })`
  transform: scaleX(-1);
`;
