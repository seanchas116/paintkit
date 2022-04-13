import React, { useState } from "react";
import { ContextMenu } from "./ContextMenu";
import { MenuItem } from "./Menu";

export const Dropdown: React.VFC<{
  options: readonly MenuItem[];
  button: (open: boolean, toggleOpen: (anchor: Element) => void) => JSX.Element;
}> = ({ options, button }) => {
  const [indexPath, setIndexPath] = useState<number[] | undefined>(undefined);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  return (
    <>
      {button(!!indexPath, (anchor) => {
        const rect = anchor.getBoundingClientRect();
        setIndexPath([0]);
        setLeft(rect.left);
        setTop(rect.bottom);
      })}
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
