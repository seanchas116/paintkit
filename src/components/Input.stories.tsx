import React, { useState } from "react";
import styled from "styled-components";
import layersIcon from "@iconify-icons/ic/outline-layers";
import { MIXED } from "../util/Mixed";
import { Input } from "./Input";

export default {
  component: Input,
};

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 72px 100px;
  align-items: center;
  gap: 8px;
`;

export const Basic: React.FC = () => {
  const [value0, setValue0] = useState("Text");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [mixedValue, setMixedValue] = useState<string | typeof MIXED>(MIXED);

  return (
    <>
      <Wrap>
        <Input
          value={value0}
          onChange={(value) => {
            setValue0(value);
            return true;
          }}
        />
        <div>{value0}</div>
        <Input
          icon={layersIcon}
          title="Z Index"
          value={value0}
          onChange={(value) => {
            setValue0(value);
            return true;
          }}
        />
        <div>{value0}</div>
        <Input
          label="W"
          title="Width"
          value={value0}
          onChange={(value) => {
            setValue0(value);
            return true;
          }}
        />
        <div>{value0}</div>
        <Input
          icon={layersIcon}
          iconPosition="left"
          title="Z Index"
          value={value0}
          onChange={(value) => {
            setValue0(value);
            return true;
          }}
        />
        <div>{value0}</div>
        <Input
          label="W"
          iconPosition="left"
          title="Width"
          value={value0}
          onChange={(value) => {
            setValue0(value);
            return true;
          }}
        />
        <div>{value0}</div>
        <Input
          placeholder="Placeholder"
          value={value1}
          onChange={(value) => {
            setValue1(value);
            return true;
          }}
        />
        <div>{value1}</div>
        <Input
          placeholder="More than 4 characters"
          value={value2}
          validate={(value) => {
            if (value.length > 4) {
              return { value: true };
            } else {
              return { value: false, error: "Input more than 4 characters" };
            }
          }}
          onChange={(value) => {
            setValue2(value);
            return true;
          }}
        />
        <div>{value2}</div>
        <Input
          value={mixedValue}
          onChange={(value) => {
            setMixedValue(value);
            return true;
          }}
        />
        <div>{mixedValue.toString()}</div>
      </Wrap>
    </>
  );
};
