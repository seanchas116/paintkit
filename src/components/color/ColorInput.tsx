import Tippy from "@tippyjs/react";
import React from "react";
import styled from "styled-components";
import { Color } from "../../util/Color";
import { MIXED } from "../../util/Mixed";
import { popoverStyle } from "../Common";
import { Input } from "../Input";
import { colors } from "../Palette";
import { PopoverCaster } from "../PopoverCaster";
import { ColorPicker } from "./ColorPicker";

const ColorInputWrap = styled.div`
  position: relative;
  height: 24px;
`;

const ColorInputInput = styled(Input)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ColorButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ColorButtonColor = styled.div`
  width: 12px;
  height: 12px;
  background: currentColor;
  border-radius: 2px;
  box-shadow: 0 0 0 1px ${colors.popoverBorder};
`;

const ColorPickerWrap = styled.div`
  ${popoverStyle}
  padding: 8px;
`;

export const ColorInput: React.FC<{
  color?: Color | typeof MIXED;
  text?: string | typeof MIXED;
  title?: string;
  placeholder?: string;
  onChangeColor?: (color?: Color) => void;
  onChangeEndColor?: (color?: Color) => void;
  onChangeText?: (text: string) => boolean;
  className?: string;
}> = ({
  color,
  text,
  title,
  placeholder,
  onChangeColor,
  onChangeEndColor,
  onChangeText,
  className,
}) => {
  return (
    <ColorInputWrap className={className}>
      <ColorInputInput
        value={text}
        icon=" "
        placeholder={placeholder}
        onChange={onChangeText}
      />
      <PopoverCaster
        anchor={(open) => {
          const button = (
            <ColorButton
              onClick={(e) => {
                open(e.currentTarget.getBoundingClientRect());
              }}
            >
              <ColorButtonColor
                style={{
                  color:
                    typeof color === "object" ? color.toHex() : "transparent",
                }}
              />
            </ColorButton>
          );

          return title ? <Tippy content={title}>{button}</Tippy> : button;
        }}
        popover={() => {
          return (
            <ColorPickerWrap>
              <ColorPicker
                color={
                  typeof color === "object" ? color : Color.fromName("white")
                }
                onChange={onChangeColor}
                onChangeEnd={onChangeEndColor}
              />
            </ColorPickerWrap>
          );
        }}
      />
    </ColorInputWrap>
  );
};
