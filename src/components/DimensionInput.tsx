import { Icon } from "@iconify/react/dist/offline";
import keyboardArrowDown from "@iconify-icons/ic/outline-keyboard-arrow-down";
import React from "react";
import styled from "styled-components";
import { MIXED } from "../util/Mixed";
import { Input, InputCommonProps } from "./Input";
import { Select } from "./Select";
import { colors } from "./Palette";

export type Dimension =
  | {
      keyword: string;
    }
  | {
      value: number;
      unit: string;
    };

export const Dimension = {
  parse: (value: string): Dimension => {
    const match = value.match(/^(-?[0-9.]+)([A-Za-z%]*)$/);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit: match[2],
      };
    }
    return {
      keyword: value,
    };
  },
  stringify: (value: Dimension): string => {
    if ("keyword" in value) {
      return value.keyword;
    }
    return `${value.value}${value.unit}`;
  },
};

export interface DimensionInputProps extends InputCommonProps {
  value?: string | typeof MIXED;
  units?: readonly string[];
  keywords?: readonly string[];
  onChange?: (value?: string) => boolean;
}

const DimensionInputWrap = styled.div`
  height: 24px;
  position: relative;
`;

const DimensionInputInput = styled(Input)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const DimensionInputSelect = styled(Select)`
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 100%;
`;

const DimensionInputSelectButton = styled.div`
  background: none;
  border: none;
  padding: 0;
  font-size: 10px;
  font-weight: 500;
  color: ${colors.disabledText};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: right;
  height: 100%;
  cursor: pointer;
`;

export const DimensionInput: React.FC<DimensionInputProps> = ({
  className,
  style,
  value: valueString,
  placeholder: placeholderString,
  units = ["px"],
  keywords = [],
  onChange,
  ...commonProps
}) => {
  if (units.length === 0) {
    throw new Error("units must not be empty");
  }

  const value =
    typeof valueString === "string" ? Dimension.parse(valueString) : undefined;

  const placeholder = placeholderString
    ? Dimension.parse(placeholderString)
    : undefined;

  const inputValue = value
    ? "keyword" in value
      ? value.keyword
      : String(value.value)
    : undefined;
  const inputPlaceholder = placeholder
    ? "keyword" in placeholder
      ? placeholder.keyword
      : String(placeholder.value)
    : undefined;

  const unit = value && "unit" in value ? value.unit : undefined;
  const placeholderUnit =
    placeholder && "unit" in placeholder ? placeholder.unit : undefined;

  return (
    <DimensionInputWrap className={className} style={style}>
      <DimensionInputInput
        {...commonProps}
        iconPosition="left"
        value={valueString === MIXED ? MIXED : inputValue}
        placeholder={inputPlaceholder}
        validate={(text) => {
          if (!text) {
            return { isValid: true };
          }

          const dimension = Dimension.parse(text);
          if (dimension) {
            return { isValid: true };
          }

          return {
            isValid: false,
            message: "Input text must be a valid number or keyword.",
          };
        }}
        onChange={(newInputValue) => {
          if (!newInputValue) {
            return onChange?.(undefined) ?? false;
          }

          const dimension = Dimension.parse(newInputValue);
          if (!dimension) {
            return false;
          }

          if ("keyword" in dimension) {
            return (
              onChange?.(Dimension.stringify({ keyword: newInputValue })) ??
              false
            );
          }

          return (
            onChange?.(
              Dimension.stringify({
                value: dimension.value,
                unit: dimension.unit || unit || units[0],
              })
            ) ?? false
          );
        }}
      />
      <DimensionInputSelect
        value={value && "keyword" in value ? value.keyword : value?.unit}
        tabIndex={-1}
        placeholder={
          placeholder && "keyword" in placeholder
            ? placeholder.keyword
            : placeholder?.unit
        }
        options={[
          ...units.map((unit) => ({
            label: unit,
            value: unit,
          })),
          {
            type: "separator",
          },
          ...keywords.map((keyword) => ({
            label: keyword,
            value: keyword,
          })),
        ]}
        renderButton={(open) => (
          <DimensionInputSelectButton onClick={open}>
            {unit ? (
              unit
            ) : !value && placeholderUnit ? (
              placeholderUnit
            ) : (
              <Icon icon={keyboardArrowDown} />
            )}
          </DimensionInputSelectButton>
        )}
        onChange={(newUnit) => {
          if (keywords.includes(newUnit)) {
            return (
              onChange?.(Dimension.stringify({ keyword: newUnit })) ?? false
            );
          }
          const newValue = value && "value" in value ? value.value : 0;
          return (
            onChange?.(
              Dimension.stringify({
                value: newValue,
                unit: newUnit,
              })
            ) ?? false
          );
        }}
      />
    </DimensionInputWrap>
  );
};
