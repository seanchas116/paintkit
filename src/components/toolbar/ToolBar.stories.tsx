import React, { useState } from "react";
import menuIcon from "@iconify-icons/ic/outline-menu";
import paragraphIcon from "../../icon/Paragraph";
import frameIcon from "../../icon/Frame";
import { ToolButton, ToolButtonArray } from "./ToolButton";
import { ToolBar } from "./ToolBar";
import { ZoomControl } from "./ZoomControl";

export default {
  component: ToolBar,
};

export const Basic: React.VFC = () => {
  const [itemToInsert, setItemToInsert] = useState("frame");

  return (
    <ToolBar>
      <ToolButton label="Menu" icon={menuIcon} />

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

      <ZoomControl
        percentage={100}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        onChangePercentage={() => {}}
      />
    </ToolBar>
  );
};
