import React, { useState } from "react";
import htmlTags from "html-tags";
import styled from "styled-components";
import formatAlignLeftIcon from "@iconify-icons/ic/outline-format-align-left";
import formatAlignCenterIcon from "@iconify-icons/ic/outline-format-align-center";
import formatAlignRightIcon from "@iconify-icons/ic/outline-format-align-right";
import { Icon } from "@iconify/react/dist/offline";
import { Select, SelectItem } from "./Select";

export default {
  component: Select,
};

const StyledSelect = styled(Select)`
  width: 100px;
`;

export const Basic: React.FC = () => {
  const [value, setValue] = useState("left");

  const options = [{ value: "left" }, { value: "center" }, { value: "right" }];

  return <StyledSelect value={value} onChange={setValue} options={options} />;
};

export const WithIcons: React.FC = () => {
  const [value, setValue] = useState("left");

  const options = [
    {
      value: "left",
      icon: <Icon icon={formatAlignLeftIcon} width={12} height={12} />,
    },
    {
      value: "center",
      icon: <Icon icon={formatAlignCenterIcon} width={12} height={12} />,
    },
    {
      value: "right",
      icon: <Icon icon={formatAlignRightIcon} width={12} height={12} />,
    },
  ];

  return <StyledSelect value={value} onChange={setValue} options={options} />;
};

export const ManyOptions: React.FC = () => {
  const [value, setValue] = useState("div");

  return (
    <StyledSelect
      options={htmlTags.map((tag) => ({ value: tag }))}
      value={value}
      onChange={setValue}
    />
  );
};

export const SeparatorAndHeader: React.FC = () => {
  const [value, setValue] = useState("left");

  const options: SelectItem[] = [
    { type: "header", text: "Horizontal" },
    {
      value: "left",
      icon: <Icon icon={formatAlignLeftIcon} width={12} height={12} />,
    },
    {
      value: "center",
      icon: <Icon icon={formatAlignCenterIcon} width={12} height={12} />,
    },
    {
      value: "right",
      icon: <Icon icon={formatAlignRightIcon} width={12} height={12} />,
    },
    { type: "separator" },
    { type: "header", text: "Vertical" },
    { value: "top" },
    { value: "center" },
    { value: "bottom" },
  ];

  return <StyledSelect value={value} onChange={setValue} options={options} />;
};

const CenterInViewport = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const CenterOfViewport: React.FC = () => {
  const [value, setValue] = useState("foo");

  return (
    <CenterInViewport>
      <StyledSelect
        value={value}
        onChange={setValue}
        options={[{ value: "foo" }, { value: "bar" }, { value: "baz" }]}
      />
    </CenterInViewport>
  );
};
