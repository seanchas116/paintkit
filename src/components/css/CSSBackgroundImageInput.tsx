import Tippy from "@tippyjs/react";
import React from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react/dist/offline";
import { BackgroundLayer } from "../../util/BackgroundLayer";
import { MIXED } from "../../util/Mixed";
import { popoverStyle } from "../Common";
import { Input } from "../Input";
import { colors } from "../Palette";
import { PopoverCaster } from "../PopoverCaster";
import imageFillIcon from "../../icon/Image";
import { CSSBackgroundImagePicker } from "./CSSBackgroundImagePicker";

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
`;

export const CSSBackgroundImageInput: React.FC<{
  className?: string;
  title?: string;
  placeholder?: string;
  value?: string | typeof MIXED;
  onChange?: (value?: string) => void;
  onChangeEnd?: () => void;
}> = ({ className, title, placeholder, value, onChange, onChangeEnd }) => {
  const bgLayer = (() => {
    try {
      return typeof value === "string"
        ? BackgroundLayer.fromString(value)
        : undefined;
    } catch (e) {
      return undefined;
    }
  })();

  return (
    <ColorInputWrap className={className}>
      <ColorInputInput
        value={value}
        icon=" "
        placeholder={placeholder}
        onChange={(value) => {
          onChange?.(value);
          onChangeEnd?.();
          return true;
        }}
      />
      <PopoverCaster
        anchor={(open) => {
          const button = (
            <ColorButton
              onClick={(e) => {
                open(e.currentTarget.getBoundingClientRect());
              }}
            >
              {bgLayer ? (
                <ColorButtonColor
                  style={{
                    background: typeof value === "string" ? value : "none",
                  }}
                />
              ) : (
                <Icon
                  style={{
                    color: colors.disabledText,
                  }}
                  icon={imageFillIcon}
                />
              )}
            </ColorButton>
          );

          return title ? <Tippy content={title}>{button}</Tippy> : button;
        }}
        popover={() => {
          return (
            <ColorPickerWrap>
              <CSSBackgroundImagePicker
                value={bgLayer}
                onChange={(value) => {
                  onChange?.(value?.toCSSValue().toString() ?? "none");
                }}
                onChangeEnd={() => {
                  onChangeEnd?.();
                }}
              />
            </ColorPickerWrap>
          );
        }}
      />
    </ColorInputWrap>
  );
};
