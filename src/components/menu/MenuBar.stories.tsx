import React, { useState } from "react";
import { KeyGesture } from "../../util/KeyGesture";
import { Menu } from "./Menu";
import { MenuBar } from "./MenuBar";

export default {
  title: "MenuBar",
  component: MenuBar,
};

const menus: Menu[] = [
  {
    title: "File",
    children: [
      {
        title: "New",
        shortcut: [new KeyGesture(["Command"], "KeyN")],
      },
      { type: "separator" },
      {
        title: "Open...",
        shortcut: [new KeyGesture(["Command"], "KeyO")],
      },
      {
        title: "Open Recent",
        children: [
          {
            title: "Document 1",
          },
          {
            title: "Document 2",
          },
          {
            title: "Document 3",
          },
        ],
      },
      { type: "separator" },
      {
        title: "Save",
        shortcut: [new KeyGesture(["Command"], "KeyS")],
      },
      {
        title: "Save As...",
        shortcut: [new KeyGesture(["Shift", "Command"], "KeyS")],
      },
    ],
  },
  {
    title: "Edit",
    children: [
      {
        title: "Undo",
        shortcut: [new KeyGesture(["Command"], "KeyZ")],
      },
      {
        title: "Redo",
        shortcut: [new KeyGesture(["Shift", "Command"], "KeyZ")],
      },
      { type: "separator" },
      {
        title: "Cut",
        shortcut: [new KeyGesture(["Command"], "KeyX")],
      },
      {
        title: "Copy",
        shortcut: [new KeyGesture(["Command"], "KeyC")],
      },
      {
        title: "Paste",
        shortcut: [new KeyGesture(["Command"], "KeyV")],
      },
      {
        title: "Delete",
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
