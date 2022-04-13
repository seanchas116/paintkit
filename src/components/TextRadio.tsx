import React from "react";
import styled from "styled-components";
import { RadioItemBase, RadioWrapBase } from "./Common";

const TextRadioItem = styled(RadioItemBase)`
  flex: 1;
  line-height: 20px;
  text-align: center;
  padding-left: 6px;
  padding-right: 6px;
  white-space: nowrap;
`;

const TextRadioWrap = styled(RadioWrapBase)`
  display: flex;
  gap: 2px;
`;

interface TextRadioItem<T extends string> {
  value: T;
  text: string;
}

export function TextRadio<T extends string>({
  className,
  options,
  value,
  placeholder,
  unsettable,
  onChange,
}: {
  className?: string;
  options: readonly TextRadioItem<T>[];
  value?: T;
  placeholder?: T;
  unsettable?: boolean;
  onChange?: (value: T | undefined) => void;
}): JSX.Element {
  return (
    <TextRadioWrap className={className}>
      {options.map((opt) => (
        <TextRadioItem
          key={opt.value}
          checkedAsPlaceholder={!value && opt.value === placeholder}
          checked={opt.value === value}
          onClick={() => {
            if (unsettable && opt.value === value) {
              onChange?.(undefined);
            } else {
              onChange?.(opt.value);
            }
          }}
        >
          {opt.text}
        </TextRadioItem>
      ))}
    </TextRadioWrap>
  );
}
