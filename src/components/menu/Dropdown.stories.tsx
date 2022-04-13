import React from "react";
import { KeyGesture } from "../../util/KeyGesture";
import { MoreButton } from "../IconButton";
import { MenuItem } from "./Menu";
import { Dropdown } from "./Dropdown";

export default {
  title: "Dropdown",
  component: Dropdown,
};

const options: MenuItem[] = [
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
  {
    type: "separator",
  },
  {
    title: "Submenu",
    children: [
      {
        title: "Item 1",
        selected: true,
      },
      {
        title: "Item 2",
      },
      {
        title: "Item 3",
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
