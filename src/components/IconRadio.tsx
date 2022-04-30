import { Icon } from "@iconify/react/dist/offline";
import { IconifyIcon } from "@iconify/types";
import Tippy from "@tippyjs/react";
import React from "react";
import styled from "styled-components";
import { MIXED } from "../util/Mixed";
import { RadioItemBase, RadioWrapBase } from "./Common";
import { colors } from "./Palette";

const IconRadioItem = styled(RadioItemBase)`
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${(p) =>
    p.checked || p.checkedAsPlaceholder
      ? colors.activeText
      : p.disabled
      ? colors.disabledText
      : colors.icon};

  :active {
    transform: scale(0.9);
  }

  > svg {
    width: 16px;
    height: 16px;
  }
`;

const IconRadioWrap = styled(RadioWrapBase)`
  display: flex;
  width: fit-content;
`;

interface IconRadioOption<T extends string> {
  value: T;
  icon: IconifyIcon;
  text?: string;
  disabled?: boolean;
}

export function IconRadio<T extends string>({
  className,
  options,
  value,
  placeholder,
  unsettable,
  onChange,
}: {
  className?: string;
  options: IconRadioOption<T>[];
  value?: T | typeof MIXED;
  placeholder?: T;
  unsettable?: boolean;
  onChange?: (value: T | undefined) => void;
}): JSX.Element {
  return (
    <IconRadioWrap className={className}>
      {options.map((opt) => (
        <Tippy content={opt.text || opt.value} key={opt.value}>
          <IconRadioItem
            checkedAsPlaceholder={!value && opt.value === placeholder}
            checked={opt.value === value}
            disabled={opt.disabled}
            onClick={() => {
              if (unsettable && opt.value === value) {
                onChange?.(undefined);
              } else {
                onChange?.(opt.value);
              }
            }}
          >
            <Icon icon={opt.icon} />
          </IconRadioItem>
        </Tippy>
      ))}
    </IconRadioWrap>
  );
}
