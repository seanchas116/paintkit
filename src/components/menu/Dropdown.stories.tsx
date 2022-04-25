import React from "react";
import { KeyGesture } from "../../util/KeyGesture";
import { MoreButton } from "../IconButton";
import { MenuItem } from "./Menu";
import { Dropdown } from "./Dropdown";

export default {
  component: Dropdown,
};

const options: MenuItem[] = [
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
  {
    type: "separator",
  },
  {
    text: "Submenu",
    children: [
      {
        text: "Item 1",
        selected: true,
      },
      {
        text: "Item 2",
      },
      {
        text: "Item 3",
      },
    ],
  },
];

export const Basic: React.FC = () => {
  return (
    <Dropdown
      options={options}
      button={(open, toggleOpen) => (
        <MoreButton
          aria-pressed={open}
          onClick={(e) => toggleOpen(e.currentTarget)}
        />
      )}
    />
  );
};
