import React, { useState } from "react";
import formatAlignLeftIcon from "@iconify-icons/ic/outline-format-align-left";
import formatAlignCenterIcon from "@iconify-icons/ic/outline-format-align-center";
import formatAlignRightIcon from "@iconify-icons/ic/outline-format-align-right";
import { IconRadio } from "./IconRadio";

export default {
  title: "IconRadio",
  component: IconRadio,
};

export const Basic: React.FC = () => {
  const [value, setValue] = useState<string | undefined>();

  const options = [
    {
      value: "left",
      icon: formatAlignLeftIcon,
    },
    {
      value: "center",
      icon: formatAlignCenterIcon,
    },
    {
      value: "right",
      icon: formatAlignRightIcon,
      disabled: true,
    },
  ];

  return (
    <IconRadio
      options={options}
      value={value}
      placeholder="left"
      onChange={setValue}
    />
  );
};
