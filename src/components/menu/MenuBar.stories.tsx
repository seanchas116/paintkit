import React, { useState } from "react";
import { KeyGesture } from "../../util/KeyGesture";
import { Menu } from "./Menu";
import { MenuBar } from "./MenuBar";

export default {
  component: MenuBar,
};

const menus: Menu[] = [
  {
    text: "File",
    children: [
      {
        text: "New",
        shortcut: [new KeyGesture(["Command"], "KeyN")],
      },
      { type: "separator" },
      {
        text: "Open...",
        shortcut: [new KeyGesture(["Command"], "KeyO")],
      },
      {
        text: "Open Recent",
        children: [
          {
            text: "Document 1",
          },
          {
            text: "Document 2",
          },
          {
            text: "Document 3",
          },
        ],
      },
      { type: "separator" },
      {
        text: "Save",
        shortcut: [new KeyGesture(["Command"], "KeyS")],
      },
      {
        text: "Save As...",
        shortcut: [new KeyGesture(["Shift", "Command"], "KeyS")],
      },
    ],
  },
  {
    text: "Edit",
    children: [
      {
        text: "Undo",
        shortcut: [new KeyGesture(["Command"], "KeyZ")],
      },
      {
        text: "Redo",
        shortcut: [new KeyGesture(["Shift", "Command"], "KeyZ")],
      },
      { type: "separator" },
      {
        text: "Cut",
        shortcut: [new KeyGesture(["Command"], "KeyX")],
      },
      {
        text: "Copy",
        shortcut: [new KeyGesture(["Command"], "KeyC")],
      },
      {
        text: "Paste",
        shortcut: [new KeyGesture(["Command"], "KeyV")],
      },
      {
        text: "Delete",
      },
    ],
  },
];

export const Basic: React.FC = () => {
  const [indexPath, setIndexPath] = useState<readonly number[]>([]);

  return (
    <MenuBar
      menu={menus}
      indexPath={indexPath}
      onChangeIndexPath={setIndexPath}
    />
  );
};
