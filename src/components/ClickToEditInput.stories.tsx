import React, { useState } from "react";
import styled from "styled-components";
import { MIXED } from "../util/Mixed";
import { ClickToEditInput } from "./ClickToEditInput";

export default {
  component: ClickToEditInput,
};

const StyledClickToEditInput = styled(ClickToEditInput)`
  width: 200px;
`;

const CustomStyleClickToEditInput = styled(ClickToEditInput)`
  width: 300px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: 700;
  font-style: italic;
  text-align: center;
`;

const Simple: React.FC = () => {
  const [value, setValue] = useState("hogehoge");
  const [editing, setEditing] = useState(false);

  return (
    <StyledClickToEditInput
      value={value}
      onChange={(value) => {
        setValue(value);
        return true;
      }}
      editing={editing}
      onEditingChange={setEditing}
    />
  );
};

const DoubleClick: React.FC = () => {
  const [value, setValue] = useState("Double Click");
  const [editing, setEditing] = useState(false);

  return (
    <StyledClickToEditInput
      trigger="doubleClick"
      value={value}
      onChange={(value) => {
        setValue(value);
        return true;
      }}
      editing={editing}
      onEditingChange={setEditing}
    />
  );
};

const Placeholder: React.FC = () => {
  const [value, setValue] = useState("");
  const [editing, setEditing] = useState(false);

  return (
    <StyledClickToEditInput
      value={value}
      placeholder="Placeholder"
      onChange={(value) => {
        setValue(value);
        return true;
      }}
      editing={editing}
      onEditingChange={setEditing}
    />
  );
};

const Mixed: React.FC = () => {
  const [value, setValue] = useState<string | typeof MIXED>(MIXED);
  const [editing, setEditing] = useState(false);

  return (
    <StyledClickToEditInput
      value={value}
      placeholder="Placeholder"
      onChange={(value) => {
        setValue(value || MIXED);
        return true;
      }}
      editing={editing}
      onEditingChange={setEditing}
    />
  );
};

const LongText: React.FC = () => {
  const [value, setValue] = useState("Very Loooooooooooooooooooooong Text");
  const [editing, setEditing] = useState(false);

  return (
    <StyledClickToEditInput
      value={value}
      onChange={(value) => {
        setValue(value);
        return true;
      }}
      editing={editing}
      onEditingChange={setEditing}
    />
  );
};

function validateEmail(email: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const Validated: React.FC = () => {
  const [value, setValue] = useState("");
  const [editing, setEditing] = useState(false);

  return (
    <StyledClickToEditInput
      value={value}
      onChange={(value) => {
        setValue(value);
        return true;
      }}
      placeholder="Email Address"
      validate={(value) => {
        if (!validateEmail(value)) {
          return { value: false, error: "Input a valid email address." };
        }
        return { value: true };
      }}
      editing={editing}
      onEditingChange={setEditing}
    />
  );
};

const Disabled: React.FC = () => {
  return <StyledClickToEditInput value="Disabled" disabled />;
};

const CustomStyle: React.FC = () => {
  const [value, setValue] = useState("Custom Style");
  const [editing, setEditing] = useState(false);

  return (
    <CustomStyleClickToEditInput
      value={value}
      onChange={(value) => {
        setValue(value);
        return true;
      }}
      editing={editing}
      onEditingChange={setEditing}
    />
  );
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Basic: React.FC = () => {
  return (
    <Wrap>
      <Simple />
      <DoubleClick />
      <Placeholder />
      <Mixed />
      <LongText />
      <Validated />
      <Disabled />
      <CustomStyle />
    </Wrap>
  );
};
