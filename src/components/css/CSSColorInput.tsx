import React from "react";
import styled from "styled-components";
import { Color } from "../../util/Color";
import { MIXED } from "../../util/Mixed";
import { ColorPicker } from "../color/ColorPicker";
import { colors } from "../Palette";
import { PopoverComboBox } from "../PopoverComboBox";
import { SelectItem } from "../Select";

const ColorButtonColor = styled.div`
  width: 12px;
  height: 12px;
  background: currentColor;
  border-radius: 2px;
  box-shadow: 0 0 0 1px ${colors.popoverBorder};
`;

export const CSSColorInput: React.FC<{
  className?: string;
  title?: string;
  placeholder?: string;
  value?: string | typeof MIXED;
  options?: readonly SelectItem[];
  defaultPlacement?: "top" | "bottom";
  onChange?: (value?: string) => void;
  onChangeEnd?: (value?: string) => void;
}> = ({
  className,
  title,
  placeholder,
  value,
  options,
  defaultPlacement,
  onChange,
  onChangeEnd,
}) => {
  const color = typeof value === "string" ? Color.fromCSS(value) : undefined;

  return (
    <PopoverComboBox
      className={className}
      value={value}
      title={title}
      placeholder={placeholder}
      options={options}
      defaultPlacement={defaultPlacement}
      onChange={(value) => {
        onChange?.(value);
        return false;
      }}
      renderPopover={() => {
        return (
          <ColorPicker
            color={typeof color === "object" ? color : Color.fromName("white")}
            onChange={(color) => onChange?.(color?.toString())}
            onChangeEnd={(color) => onChangeEnd?.(color?.toString())}
          />
        );
      }}
      renderButton={() => {
        return (
          <ColorButtonColor
            style={{
              color: typeof color === "object" ? color.toHex() : "transparent",
            }}
          />
        );
      }}
    />
  );
};
