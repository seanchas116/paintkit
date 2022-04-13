import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isNumeric } from "../util/Math";
import { useBufferedValue } from "./hooks/useBufferedValue";
import { DropdownBody, DropdownItem, DropdownWrap, inputStyle } from "./Common";
import { InputProps } from "./Input";
import { SelectOption } from "./Select";

interface SuggestedInputProps extends InputProps {
  suggestionOptions?: readonly SelectOption[];
}

const InputWrap = styled.input`
  width: 100%;
  ${inputStyle}
`;

export const SuggestedInput: React.FC<SuggestedInputProps> = (props) => {
  const [currentValue, setCurrentValue, onEditingFinish] = useBufferedValue(
    props.value ?? "",
    props.onChange
  );

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
    <DropdownWrap>
      <InputWrap
        className={props.className}
        value={currentValue}
        disabled={props.disabled}
        placeholder={props.placeholder}
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
            default: {
              setShowsSuggestion(true);
              break;
            }
          }
        }}
        onFocus={(e) => {
          e.currentTarget.select();
        }}
        onBlur={(e) => {
          setShowsSuggestion(false);
          onEditingFinish(currentValue);
        }}
        onChange={(e) => {
          setCurrentValue(e.currentTarget.value);
        }}
      />
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
    </DropdownWrap>
  );
};
