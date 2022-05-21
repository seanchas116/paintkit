import Tippy from "@tippyjs/react";
import React from "react";
import styled from "styled-components";
import { MIXED } from "../util/Mixed";
import { popoverStyle } from "./Common";
import { Input } from "./Input";
import { PopoverCaster } from "./PopoverCaster";

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

const ColorPickerWrap = styled.div`
  ${popoverStyle}
  padding: 8px;
`;

export const PopoverInput: React.FC<{
  value?: string | typeof MIXED;
  title?: string;
  placeholder?: string;
  defaultPlacement?: "top" | "bottom";
  onChange?: (text: string) => boolean;
  renderPopover?: (value?: string | typeof MIXED) => React.ReactNode;
  renderButton?: (value?: string | typeof MIXED) => React.ReactNode;
  className?: string;
}> = ({
  value,
  title,
  placeholder,
  defaultPlacement,
  onChange,
  className,
  renderPopover = () => null,
  renderButton = () => null,
}) => {
  return (
    <ColorInputWrap className={className}>
      <ColorInputInput
        value={value}
        icon=" "
        placeholder={placeholder}
        onChange={onChange}
      />
      <PopoverCaster
        defaultPlacement={defaultPlacement}
        anchor={(open) => {
          const button = (
            <ColorButton
              onClick={(e) => {
                open(e.currentTarget.getBoundingClientRect());
              }}
            >
              {renderButton(value)}
            </ColorButton>
          );

          return title ? <Tippy content={title}>{button}</Tippy> : button;
        }}
        popover={() => (
          <ColorPickerWrap>{renderPopover(value)}</ColorPickerWrap>
        )}
      />
    </ColorInputWrap>
  );
};
