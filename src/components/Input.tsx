import React from "react";
import styled from "styled-components";
import Tippy from "@tippyjs/react";
import { Icon } from "@iconify/react/dist/offline";
import { IconifyIcon } from "@iconify/types";
import { isNumeric } from "../util/Math";
import { ValidationResult } from "../util/ValidationResult";
import { useBufferedValue } from "./hooks/useBufferedValue";
import { inputStyle, popoverZIndex } from "./Common";
import { colors } from "./Palette";

export interface InputCommonProps {
  className?: string;
  title?: string;
  label?: string;
  icon?: IconifyIcon;
  disabled?: boolean;
  placeholder?: string;
  spellCheck?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface InputProps extends InputCommonProps {
  value?: string;
  onChange?: (value: string) => boolean;
  validate?: (text: string) => ValidationResult;
}

export const InputInput = styled.input`
  background: none;
  border: none;
  outline: none;
  padding: 0;
  color: inherit;
  font: inherit;
  min-width: 0;

  ::placeholder {
    color: ${colors.disabledText};
  }
  :disabled {
    color: ${colors.disabledText};
    cursor: not-allowed;
  }
`;

export const InputErrorPopup = styled.div`
  color: ${colors.activeText};
  background: ${colors.red};
  border-radius: 4px;
  padding: 0 4px;
  line-height: 16px;
  font-size: 12px;
  white-space: normal;
`;

export const InputWrap = styled.div<{ invalid?: boolean }>`
  min-width: 40px;
  height: 20px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;

  ${inputStyle}
  --border-color: ${(p) => (p.invalid ? colors.red : colors.active)};

  ${InputInput} {
    flex: 1;
  }

  ${InputErrorPopup} {
    position: absolute;
    left: 0;
    top: 24px;
    z-index: ${popoverZIndex};
  }

  ${InputInput}:not(:focus) + ${InputErrorPopup} {
    display: none;
  }
`;

const InputIcon = styled(Icon).attrs({ width: 12, height: 12 })`
  color: ${colors.disabledText};
`;

const InputIconLetter = styled.div`
  font-weight: 700;
  font-size: 10px;
  color: ${colors.disabledText};
`;

/**
 * Same as <input>, but emits onChange only on blur or when enter is pressed
 */
export const Input: React.FC<InputProps> = (props) => {
  const [currentValue, setCurrentValue, onEditingFinish] = useBufferedValue(
    props.value ?? "",
    props.onChange,
    (x) => props.validate?.(x).value ?? true
  );
  const validateResult = props.validate?.(currentValue) ?? { value: true };

  const inputRef = React.createRef<HTMLInputElement>();

  const icon = props.label ? (
    <InputIconLetter>{props.label}</InputIconLetter>
  ) : props.icon ? (
    <InputIcon icon={props.icon} />
  ) : undefined;

  return (
    <InputWrap
      className={props.className}
      invalid={!validateResult.value}
      onClick={() => {
        inputRef.current?.focus();
      }}
    >
      <InputInput
        ref={inputRef}
        value={currentValue}
        disabled={props.disabled}
        placeholder={props.placeholder}
        spellCheck={props.spellCheck}
        onKeyDown={(e) => {
          switch (e.key) {
            case "Enter": {
              onEditingFinish(currentValue);
              break;
            }
            case "ArrowUp": {
              if (currentValue && isNumeric(currentValue)) {
                onEditingFinish((parseFloat(currentValue) + 1).toString());
              }
              break;
            }
            case "ArrowDown": {
              if (currentValue && isNumeric(currentValue)) {
                onEditingFinish((parseFloat(currentValue) - 1).toString());
              }
              break;
            }
            case "Unidentified": {
              // Possible input from autocomplete
              const target = e.currentTarget;
              setTimeout(() => {
                onEditingFinish(target.value);
              }, 0);
              break;
            }
          }
        }}
        onFocus={(e) => {
          e.currentTarget.select();
          props.onFocus?.();
        }}
        onBlur={(e) => {
          onEditingFinish(currentValue);
          props.onBlur?.();
        }}
        onChange={(e) => {
          setCurrentValue(e.currentTarget.value);
        }}
      />
      {props.title ? <Tippy content={props.title}>{icon}</Tippy> : icon}
      {!validateResult.value && (
        <InputErrorPopup>{validateResult.error}</InputErrorPopup>
      )}
    </InputWrap>
  );
};

export interface MultipleInputProps extends InputCommonProps {
  values: readonly string[];
  onChange: (value: string) => boolean;
  validate?: (text: string) => ValidationResult;
}

export const MultipleInput: React.FC<MultipleInputProps> = (props) => {
  const isValueDifferent =
    props.values.length && props.values.some((v) => v !== props.values[0]);
  const value =
    props.values.length && !isValueDifferent ? props.values[0] : undefined;

  return (
    <Input
      {...props}
      placeholder={isValueDifferent ? "Multiple" : props.placeholder}
      value={value}
      onChange={props.onChange}
    />
  );
};
