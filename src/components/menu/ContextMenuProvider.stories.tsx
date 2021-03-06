import React from "react";
import styled from "styled-components";
import { KeyGesture } from "../../util/KeyGesture";
import { MenuItem } from "./Menu";
import { ContextMenuProvider, useContextMenu } from "./ContextMenuProvider";

export default {
  component: ContextMenuProvider,
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

const Area = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: lightgray;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content: React.FC = () => {
  const contextMenu = useContextMenu();

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    contextMenu.show(e.clientX, e.clientY, options);
  };

  return (
    <Area onContextMenu={onContextMenu}>
      <p>Right-click to show context menu</p>
    </Area>
  );
};

export const Basic: React.FC = () => {
  return (
    <ContextMenuProvider>
      <Content />
    </ContextMenuProvider>
  );
};
