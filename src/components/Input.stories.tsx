import React, { useState } from "react";
import styled from "styled-components";
import layersIcon from "@iconify-icons/ic/outline-layers";
import { Input } from "./Input";

export default {
  title: "Input",
  component: Input,
};

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 100px 100px;
  align-items: center;
  gap: 8px;
`;

export const Basic: React.FC = () => {
  const [value0, setValue0] = useState("Text");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

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
          value={value0}
          onChange={(value) => {
            setValue0(value);
            return true;
          }}
        />
        <div>{value0}</div>
        <Input
          label="W"
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
      </Wrap>
    </>
  );
};