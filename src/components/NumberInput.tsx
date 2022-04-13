import React from "react";
import { roundToFixed } from "@seanchas116/paintkit/src/util/Math";
import { ValidationResult } from "@seanchas116/paintkit/src/util/ValidationResult";
import { Input, InputCommonProps } from "./Input";

export interface NumberInputProps extends InputCommonProps {
  value?: number;
  digits?: number;
  onChange?: (value?: number) => boolean;
  validate?: (value?: number) => ValidationResult;
}

export const NumberInput: React.VFC<NumberInputProps> = (props) => {
  const digits = props.digits || 2;
  const value =
    props.value !== undefined
      ? String(roundToFixed(props.value, digits))
      : undefined;

  return (
    <Input
      {...props}
      value={value}
      onChange={(text) => {
        if (!text) {
          return props.onChange?.(undefined) ?? false;
        }

        const value = Number.parseFloat(text);
        if (Number.isNaN(value)) {
          return false;
        }
        return props.onChange?.(value) ?? false;
      }}
      validate={(text) => {
        if (!text) {
          return props.validate?.(undefined) ?? { value: true };
        }

        const value = Number.parseFloat(text);
        if (text && Number.isNaN(value)) {
          return {
            value: false,
            error: "Input text must be a number.",
          };
        }
        return props.validate?.(value) ?? { value: true };
      }}
    />
  );
};

export interface MultipleNumberInputProps extends InputCommonProps {
  values: readonly (number | undefined)[];
  onChange: (value?: number) => boolean;
  validate?: (value?: number) => ValidationResult;
}

export const MultipleNumberInput: React.FC<MultipleNumberInputProps> = (
  props
) => {
  const isValueDifferent =
    props.values.length && props.values.some((v) => v !== props.values[0]);
  const value =
    props.values.length && !isValueDifferent ? props.values[0] : undefined;

  return (
    <NumberInput
      {...props}
      placeholder={isValueDifferent ? "Multiple" : props.placeholder}
      value={value}
      onChange={props.onChange}
    />
  );
};
