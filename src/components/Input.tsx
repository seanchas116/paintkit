import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Tippy from "@tippyjs/react";
import { Icon } from "@iconify/react/dist/offline";
import { IconifyIcon } from "@iconify/types";
import { isEqual } from "lodash-es";
import { isNumeric } from "../util/Math";
import { ValidationResult } from "../util/ValidationResult";
import { MIXED, sameOrMixed } from "../util/Mixed";
import {
  DropdownBody,
  DropdownItem,
  DropdownWrap,
  inputStyle,
  popoverZIndex,
} from "./Common";
import { colors } from "./Palette";
import { SelectOption } from "./Select";

export interface InputCommonProps {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  icon?: IconifyIcon | string;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  placeholder?: string;
  spellCheck?: boolean;
  suggestionOptions?: readonly SelectOption[];
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface InputProps extends InputCommonProps {
  value?: string | typeof MIXED;
  onChange?: (value: string) => boolean;
  validate?: (text: string) => ValidationResult;
}

const InputInput = styled.input`
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

const InputErrorPopup = styled.div`
  color: ${colors.activeText};
  background: ${colors.red};
  border-radius: 4px;
  padding: 0 4px;
  line-height: 16px;
  font-size: 12px;
  white-space: normal;
`;

const InputWrap = styled(DropdownWrap)<{ invalid?: boolean }>`
  min-width: 40px;
  height: 20px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;

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

const InputIconIcon = styled(Icon).attrs({ width: 12, height: 12 })`
  color: ${colors.disabledText};
`;

const InputIconLetter = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 10px;
  min-width: 12px;
  color: ${colors.disabledText};
`;

export const InputIcon: React.FC<{
  title?: string;
  icon: IconifyIcon | string;
}> = ({ icon, title }) => {
  const iconBody =
    typeof icon === "string" ? (
      <InputIconLetter tabIndex={-1}>{icon}</InputIconLetter>
    ) : (
      <InputIconIcon icon={icon} tabIndex={-1} />
    );

  return title ? <Tippy content={title}>{iconBody}</Tippy> : iconBody;
};

/**
 * Same as <input>, but emits onChange only on blur or when enter is pressed
 */
export const Input: React.FC<InputProps> = ({
  iconPosition = "left",
  ...props
}) => {
  const originalValue = typeof props.value === "string" ? props.value : "";
  const [currentValue, setCurrentValue] = useState(originalValue);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    setDirty(false);
    setCurrentValue(originalValue);
  }, [originalValue]);
  const validate = (x: string) => props.validate?.(x).isValid ?? true;

  const onEditingFinish = (newValue: string) => {
    if (!dirty) {
      return;
    }

    setCurrentValue(newValue);
    if (!isEqual(newValue, originalValue)) {
      try {
        if (validate && !validate(newValue)) {
          setCurrentValue(originalValue);
          return;
        }

        if (!props.onChange?.(newValue)) {
          setCurrentValue(originalValue);
        }
      } catch (e) {
        console.error(e);
        setCurrentValue(originalValue);
      }
    }
  };

  const validateResult = props.validate?.(currentValue) ?? { isValid: true };

  const inputRef = React.createRef<HTMLInputElement>();

  const [showsSuggestion, setShowsSuggestion] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  useEffect(() => {
    setSuggestionIndex(0);
  }, [currentValue]);

  const suggestions = currentValue
    ? (props.suggestionOptions ?? []).filter((c) =>
        c.value.toLowerCase().startsWith(currentValue.toLowerCase())
      )
    : [];

  const suggestionVisible = showsSuggestion && suggestions.length > 0;

  return (
    <InputWrap
      className={props.className}
      style={props.style}
      invalid={!validateResult.isValid}
      onClick={() => {
        inputRef.current?.focus();
      }}
    >
      {props.icon && iconPosition === "left" && (
        <InputIcon icon={props.icon} title={props.title} />
      )}
      <InputInput
        ref={inputRef}
        value={currentValue}
        disabled={props.disabled}
        placeholder={props.value === MIXED ? "Mixed" : props.placeholder}
        spellCheck={props.spellCheck}
        onKeyDown={(e) => {
          switch (e.key) {
            case "Enter": {
              if (suggestionVisible) {
                const current: string | undefined =
                  suggestions[suggestionIndex]?.value;
                if (current) {
                  setShowsSuggestion(false);
                  onEditingFinish(current);
                  break;
                }
              }
              onEditingFinish(currentValue);
              break;
            }
            case "Escape": {
              setShowsSuggestion(false);
              break;
            }
            case "ArrowUp": {
              if (suggestionVisible) {
                setSuggestionIndex(Math.max(0, suggestionIndex - 1));
                e.preventDefault();
                break;
              }
              if (currentValue && isNumeric(currentValue)) {
                onEditingFinish((parseFloat(currentValue) + 1).toString());
              }
              break;
            }
            case "ArrowDown": {
              if (suggestionVisible) {
                setSuggestionIndex(
                  Math.min(suggestions.length - 1, suggestionIndex + 1)
                );
                e.preventDefault();
                break;
              }
              if (!showsSuggestion && suggestions.length) {
                setShowsSuggestion(true);
                break;
              }

              if (currentValue && isNumeric(currentValue)) {
                onEditingFinish((parseFloat(currentValue) - 1).toString());
              }
              break;
            }
            case "Unidentified": {
              // Possible input from native autocomplete
              const target = e.currentTarget;
              setTimeout(() => {
                onEditingFinish(target.value);
              }, 0);
              break;
            }
            default: {
              setShowsSuggestion(true);
              break;
            }
          }
        }}
        onFocus={(e) => {
          e.currentTarget.select();
          props.onFocus?.();
        }}
        onBlur={(e) => {
          setShowsSuggestion(false);
          onEditingFinish(currentValue);
          props.onBlur?.();
        }}
        onChange={(e) => {
          setDirty(true);
          setCurrentValue(e.currentTarget.value);
        }}
      />
      {props.icon && iconPosition === "right" && (
        <InputIcon icon={props.icon} title={props.title} />
      )}
      {!validateResult.isValid && (
        <InputErrorPopup>{validateResult.message}</InputErrorPopup>
      )}
      {suggestionVisible && (
        <DropdownBody>
          {suggestions.map((s, i) => (
            <DropdownItem
              key={s.value}
              selected={i === suggestionIndex}
              onMouseDown={() => {
                setShowsSuggestion(false);
                onEditingFinish(s.value);
              }}
            >
              {s.icon}
              {s.value}
            </DropdownItem>
          ))}
        </DropdownBody>
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
  return <Input {...props} value={sameOrMixed(props.values)} />;
};
