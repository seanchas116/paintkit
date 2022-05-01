import React from "react";
import styled from "styled-components";
import { downIconStyle } from "./Common";
import { Select, SelectOption, SelectItem } from "./Select";
import { Input, InputProps } from "./Input";

interface ComboBoxProps extends Omit<InputProps, "suggestionOptions"> {
  truncatesOptions?: boolean;
  options?: readonly SelectItem[];
}

const Title = styled.div`
  width: 100%;
  position: relative;
`;

const DownButton = styled.button`
  ${downIconStyle}
  position: absolute;
  width: 20px;
  height: 20px;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
`;

const TitleInput = styled(Input)`
  width: 100%;
`;

export const ComboBox: React.FC<ComboBoxProps> = ({
  className,
  truncatesOptions,
  options = [],
  ...inputProps
}) => {
  return (
    <Select
      className={className}
      truncatesOptions={truncatesOptions}
      options={options}
      value={inputProps.value}
      onChange={inputProps.onChange}
      renderButton={(open) => {
        return (
          <Title>
            <TitleInput
              {...inputProps}
              suggestionOptions={options.filter(
                (option): option is SelectOption => {
                  return !(
                    "type" in option &&
                    (option.type === "separator" || option.type === "header")
                  );
                }
              )}
            />
            <DownButton onClick={open} />
          </Title>
        );
      }}
    />
  );
};
