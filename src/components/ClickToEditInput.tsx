import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { MIXED } from "../util/Collection";
import { InputProps } from "./Input";
import { colors } from "./Palette";
import { popoverZIndex, textTruncate } from "./Common";

const ErrorPopup = styled.div`
  background: ${colors.red};
  padding: 0 4px;
  line-height: 16px;
  z-index: ${popoverZIndex};
`;

const Wrap = styled.div`
  height: 24px;
  line-height: 24px;
  position: relative;

  ${ErrorPopup} {
    position: absolute;
    left: 0;
    top: 24px;
    white-space: normal;
  }
`;

const Text = styled.div`
  text-align: inherit;
  ${textTruncate};
`;

const Placeholder = styled.span`
  opacity: 0.3;
`;

const Input = styled.input<{ isValid: boolean }>`
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;

  border: none;
  outline: none;
  background: none;

  font: inherit;
  text-align: inherit;
  color: inherit;

  :focus {
    background: ${colors.background};
    box-shadow: inset 0 0 0 1px
      ${(p) => (p.isValid ? colors.active : colors.red)};
    color: ${colors.text};
  }
  ::placeholder {
    color: inherit;
    opacity: 0.3;
  }
`;

const editStartDelay = 500;

export interface ClickToEditInputProps extends InputProps {
  trigger?: "click" | "doubleClick";
  ignoreDoubleClick?: boolean;
  getSelectionRange?: (text: string) => readonly [number, number];
  editing?: boolean;
  onEditingChange?: (editing: boolean) => void;
}

export const ClickToEditInput: React.FC<ClickToEditInputProps> = ({
  className,
  value: originalValue = "",
  disabled = false,
  placeholder: origialPlaceholder,
  trigger = "click",
  ignoreDoubleClick,
  onChange,
  getSelectionRange,
  validate = () => ({ value: true }),
  editing: editingExternal,
  onEditingChange: onEditingChangeExternal,
}) => {
  const value = typeof originalValue === "string" ? originalValue : "";
  const placeholder = originalValue === MIXED ? "Mixed" : origialPlaceholder;

  const [editingInternal, setEditingInternal] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const editing =
    editingExternal != null && onEditingChangeExternal != null
      ? editingExternal
      : editingInternal;
  const setEditing =
    editingExternal != null && onEditingChangeExternal != null
      ? onEditingChangeExternal
      : setEditingInternal;

  const inputElementRef = useRef<HTMLInputElement>(null);

  const editStartDelayTimer = useRef(0);

  const validateResult = validate(currentValue);

  const focusAndSelect = () => {
    inputElementRef.current?.focus();
    if (getSelectionRange) {
      inputElementRef.current?.setSelectionRange(...getSelectionRange(value));
    } else {
      inputElementRef.current?.select();
    }
  };

  const startEdit = () => {
    if (disabled) {
      return;
    }
    setEditing(true);
    setTimeout(focusAndSelect, 0);
  };

  const handleClick = () => {
    if (editing) {
      return;
    }

    if (trigger === "click") {
      if (ignoreDoubleClick) {
        editStartDelayTimer.current = window.setTimeout(() => {
          editStartDelayTimer.current = 0;
          startEdit();
        }, editStartDelay);
      } else {
        startEdit();
      }
    }
  };

  const handleDoubleClick = () => {
    if (editing) {
      return;
    }

    if (editStartDelayTimer.current) {
      clearInterval(editStartDelayTimer.current);
      editStartDelayTimer.current = 0;
    }
    if (trigger === "doubleClick") {
      startEdit();
    }
  };

  const handleEditFinish = (text: string) => {
    setEditing(false);
    setCurrentValue(value);
    if (!validate(text).value) {
      return;
    }
    onChange?.(text);
  };

  const handleInputChange = (event: React.FocusEvent<HTMLInputElement>) => {
    setCurrentValue(event.currentTarget.value);
  };

  const handleInputBlur = () => {
    handleEditFinish(currentValue);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEditFinish(currentValue);
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (disabled) {
      setEditingInternal(false);
    }
  }, [disabled]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (editingExternal) {
      focusAndSelect();
    }
  }, [editingExternal]);

  return (
    <Wrap
      className={className}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <Input
          ref={inputElementRef}
          type="text"
          value={currentValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          // Stop propagation of double click and drag
          // TODO: Do not do stopPropagation inside component
          onDoubleClick={(e) => e.stopPropagation()}
          draggable={false}
          isValid={validateResult.value}
        />
      ) : (
        <Text>{value ? value : <Placeholder>{placeholder}</Placeholder>}</Text>
      )}
      {editing && !validateResult.value && (
        <ErrorPopup>{validateResult.error}</ErrorPopup>
      )}
    </Wrap>
  );
};
