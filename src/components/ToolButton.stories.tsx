import React, { useState } from "react";
import paragraphIcon from "@seanchas116/paintkit/src/icon/Paragraph";
import frameIcon from "@seanchas116/paintkit/src/icon/Frame";
import { ToolButton, ToolButtonArray } from "./ToolButton";

export default {
  component: ToolButton,
  title: "ToolButton",
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
