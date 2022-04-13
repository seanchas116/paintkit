import React, { useEffect, useState } from "react";
import styled from "styled-components";
import keyboardArrowDownIcon from "@iconify-icons/ic/outline-keyboard-arrow-down";
import shortUUID from "short-uuid";
import { iconToDataURL } from "../util/Image";
import { colors } from "./Palette";

const keyboardArrowDownIconURL = iconToDataURL(keyboardArrowDownIcon);

const NativeComboBoxWrap = styled.div`
  height: 24px;
  position: relative;
  background-color: ${colors.uiBackground};
  border-radius: 4px;

  :focus-within {
    box-shadow: 0 0 0 1px inset ${colors.active};
  }
`;

const Select = styled.select`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: transparent;
  font-size: 12px;
  cursor: pointer;
`;

const Input = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  width: calc(100% - 24px);
  height: 100%;
  padding-left: 6px;
  font-size: 12px;
  color: ${colors.text};
  line-height: 24px;
  vertical-align: middle;

  ::-webkit-calendar-picker-indicator {
    display: none !important;
  }
`;

const DownIcon = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0px;
  right: 0px;
  width: 24px;
  height: 24px;
  mask-size: 12px;
  mask-position: center;
  mask-image: url(${keyboardArrowDownIconURL});
  mask-repeat: no-repeat;
  background-color: currentColor;
  color: ${colors.icon};
`;

interface ComboBoxProps {
  children?: React.ReactNode;
  className?: string;
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const NativeComboBox: React.VFC<ComboBoxProps> = ({
  className,
  value,
  placeholder,
  onChange,
  children,
}) => {
  const [datalistID] = useState(() => shortUUID.generate());

  const [currentValue, setCurrentValue] = useState("");
  useEffect(() => {
    setCurrentValue(value ?? "");
  }, [value]);

  const selectRef = React.createRef<HTMLSelectElement>();

  return (
    <NativeComboBoxWrap className={className}>
      <datalist id={datalistID}>{children}</datalist>
      <Select
        ref={selectRef}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        tabIndex={-1}
      >
        {children}
      </Select>
      <Input
        value={currentValue}
        list={datalistID}
        placeholder={placeholder}
        onChange={(e) => setCurrentValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          const elem = e.currentTarget;
          if (e.key === "Enter") {
            onChange(elem.value);
          } else if (e.key === "Unidentified") {
            // from datalist
            console.log(e.key);
            setTimeout(() => {
              onChange(elem.value);
            }, 0);
          }
        }}
      />
      <DownIcon
        onClick={() => {
          selectRef.current?.click();
        }}
      />
    </NativeComboBoxWrap>
  );
};
