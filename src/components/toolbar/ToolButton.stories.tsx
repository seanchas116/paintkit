import React, { useState } from "react";
import paragraphIcon from "../../icon/Paragraph";
import frameIcon from "../../icon/Frame";
import { ToolButton, ToolButtonArray } from "./ToolButton";

export default {
  component: ToolButton,
};

export const Basic: React.VFC = () => {
  const [itemToInsert, setItemToInsert] = useState("frame");

  return (
    <ToolButtonArray>
      <ToolButton
        label="Frame"
        icon={frameIcon}
        selected={itemToInsert === "frame"}
        onClick={() => {
          setItemToInsert("frame");
        }}
      />
      <ToolButton
        label="Text"
        icon={paragraphIcon}
        selected={itemToInsert === "text"}
        onClick={() => {
          setItemToInsert("text");
        }}
      />
    </ToolButtonArray>
  );
};
