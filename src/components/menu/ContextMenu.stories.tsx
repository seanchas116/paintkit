import React, { useState } from "react";
import styled from "styled-components";
import { KeyGesture } from "@seanchas116/paintkit/src/util/KeyGesture";
import { MenuItem } from "./Menu";
import { ContextMenu } from "./ContextMenu";

export default {
  title: "ContextMenu",
  component: ContextMenu,
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

export const Basic: React.FC = () => {
  const [indexPath, setIndexPath] = useState<number[] | undefined>(undefined);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIndexPath([]);
    setLeft(e.nativeEvent.clientX);
    setTop(e.nativeEvent.clientY);
  };

  return (
    <>
      <Area onContextMenu={onContextMenu}>
        <p>Right-click to show context menu</p>
      </Area>
      <ContextMenu
        options={options}
        indexPath={indexPath}
        x={left}
        y={top}
        onChangeIndexPath={setIndexPath}
      />
    </>
  );
};
