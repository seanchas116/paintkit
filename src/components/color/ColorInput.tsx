import React from "react";
import styled from "styled-components";
import { Color } from "../../util/Color";
import { MIXED } from "../../util/Mixed";
import { colors } from "../Palette";
import { PopoverComboBox } from "../PopoverComboBox";
import { SelectItem } from "../Select";
import { ColorPicker } from "./ColorPicker";

const ColorButtonColor = styled.div`
  width: 12px;
  height: 12px;
  background: currentColor;
  border-radius: 2px;
  box-shadow: 0 0 0 1px ${colors.popoverBorder};
`;

export const ColorInput: React.FC<{
  className?: string;
  color?: Color | typeof MIXED;
  text?: string | typeof MIXED;
  title?: string;
  placeholder?: string;
  options?: readonly SelectItem[];
  defaultPlacement?: "top" | "bottom";
  onChangeColor?: (color?: Color) => void;
  onChangeEndColor?: (color?: Color) => void;
  onChangeText?: (text: string) => boolean;
}> = ({
  className,
  color,
  text,
  title,
  placeholder,
  options,
  defaultPlacement,
  onChangeColor,
  onChangeEndColor,
  onChangeText,
}) => {
  return (
    <PopoverComboBox
      className={className}
      value={text}
      title={title}
      placeholder={placeholder}
      options={options}
      defaultPlacement={defaultPlacement}
      onChange={onChangeText}
      renderPopover={() => {
        return (
          <ColorPicker
            color={typeof color === "object" ? color : Color.fromName("white")}
            onChange={onChangeColor}
            onChangeEnd={onChangeEndColor}
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
