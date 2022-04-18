import { Icon } from "@iconify/react/dist/offline";
import keyboardArrowDown from "@iconify-icons/ic/outline-keyboard-arrow-down";
import React from "react";
import styled from "styled-components";
import { Input, InputCommonProps } from "./Input";
import { Select } from "./Select";
import { colors } from "./Palette";

export type DimensionInputValue =
  | {
      keyword: string;
    }
  | {
      value: number;
      unit: string;
    };

export interface DimensionInputProps extends InputCommonProps {
  value?: DimensionInputValue;
  units?: string[];
  keywords?: string[];
  onChange?: (value?: DimensionInputValue) => boolean;
}

const DimensionInputWrap = styled.div`
  width: 72px;
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
  value,
  units = ["px"],
  keywords = [],
  onChange,
  ...commonProps
}) => {
  if (units.length === 0) {
    throw new Error("units must not be empty");
  }

  const inputValue = value
    ? "keyword" in value
      ? value.keyword
      : String(value.value)
    : undefined;

  const unit = value && "unit" in value ? value.unit : undefined;

  return (
    <DimensionInputWrap className={className}>
      <DimensionInputInput
        {...commonProps}
        iconPosition="left"
        value={inputValue}
        validate={(text) => {
          if (!text) {
            return { value: true };
          }
          if (keywords.includes(text)) {
            return { value: true };
          }

          if (!Number.isNaN(Number.parseFloat(text))) {
            return { value: true };
          }
          return {
            value: false,
            error: "Input text must be a valid number or keyword.",
          };
        }}
        onChange={(newInputValue) => {
          if (!newInputValue) {
            return onChange?.(undefined) ?? false;
          }
          if (keywords.includes(newInputValue)) {
            return onChange?.({ keyword: newInputValue }) ?? false;
          }
          return (
            onChange?.({
              value: Number.parseFloat(newInputValue),
              unit: unit ?? units[0],
            }) ?? false
          );
        }}
      />
      <DimensionInputSelect
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
            {unit ?? <Icon icon={keyboardArrowDown} />}
          </DimensionInputSelectButton>
        )}
        onChange={(newUnit) => {
          if (keywords.includes(newUnit)) {
            return onChange?.({ keyword: newUnit }) ?? false;
          }
          const newValue = value && "value" in value ? value.value : 0;
          return (
            onChange?.({
              value: newValue,
              unit: newUnit,
            }) ?? false
          );
        }}
      />
    </DimensionInputWrap>
  );
};
