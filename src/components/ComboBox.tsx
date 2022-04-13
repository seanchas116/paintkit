import React from "react";
import styled from "styled-components";
import { downIconStyle } from "./Common";
import { Select, SelectOption, SelectItem } from "./Select";
import { SuggestedInput } from "./SuggestedInput";

interface ComboBoxProps {
  className?: string;
  truncatesOptions?: boolean;
  options?: readonly SelectItem[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => boolean;
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

const TitleInput = styled(SuggestedInput)`
  width: 100%;
`;

export const ComboBox: React.FC<ComboBoxProps> = ({
  className,
  truncatesOptions,
  options = [],
  value,
  placeholder,
  onChange,
}) => {
  return (
    <Select
      className={className}
      truncatesOptions={truncatesOptions}
      options={options}
      value={value}
      onChange={onChange}
      renderButton={(open) => {
        return (
          <Title>
            <TitleInput
              value={value}
              placeholder={placeholder}
              suggestionOptions={options.filter(
                (option): option is SelectOption => {
                  return !(
                    "type" in option &&
                    (option.type === "separator" || option.type === "header")
                  );
                }
              )}
              onChange={onChange}
            />
            <DownButton onClick={open} />
          </Title>
        );
      }}
    />
  );
};