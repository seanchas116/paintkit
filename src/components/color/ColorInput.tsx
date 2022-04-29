import React from "react";
import styled from "styled-components";
import { Color } from "../../util/Color";
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

  input {
    padding-left: 20px;
  }
`;

const ColorButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ColorButtonColor = styled.div`
  width: 16px;
  height: 16px;
  background: currentColor;
  border-radius: 2px;
  border: 1px solid ${colors.popoverBorder};
`;

const ColorPickerWrap = styled.div`
  ${popoverStyle}
  padding: 8px;
`;

export const ColorInput: React.FC<{
  color: Color;
  onChange: (color: Color) => void;
  onChangeEnd: (color: Color) => void;
  className?: string;
}> = ({ color, onChange, onChangeEnd, className }) => {
  return (
    <ColorInputWrap className={className}>
      <ColorInputInput
        value={color.toString()}
        onChange={(value) => {
          try {
            const newColor = Color.from(value);
            onChange(newColor);
            onChangeEnd(newColor);
            return true;
          } catch (e) {
            console.log(e);
            return false;
          }
        }}
      />
      <PopoverCaster
        anchor={(open) => (
          <ColorButton
            onClick={(e) => {
              open(e.currentTarget.getBoundingClientRect());
            }}
          >
            <ColorButtonColor
              style={{
                color: color.toHex(),
              }}
            />
          </ColorButton>
        )}
        popover={() => {
          return (
            <ColorPickerWrap>
              <ColorPicker
                color={color}
                onChange={onChange}
                onChangeEnd={onChangeEnd}
              />
            </ColorPickerWrap>
          );
        }}
      />
    </ColorInputWrap>
  );
};
