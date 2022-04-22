import React, { useEffect, useState } from "react";
import { TypedEmitter } from "tiny-typed-emitter";
import { assertNonNull } from "../../util/Assert";
import { ContextMenu } from "./ContextMenu";
import { MenuItem } from "./Menu";

class ContextMenuController extends TypedEmitter<{
  change(): void;
}> {
  options: readonly MenuItem[] = [];
  indexPath?: readonly number[]; // [] to close context menu, [0] to open context menu
  x = 0;
  y = 0;

  show(x: number, y: number, options: readonly MenuItem[]): void {
    this.options = options;
    this.x = x;
    this.y = y;
    this.onChangeIndexPath([]);
  }

  onChangeIndexPath(path: number[] | undefined) {
    this.indexPath = path;
    this.emit("change");
  }
}

const ContextMenuControllerContext = React.createContext<
  ContextMenuController | undefined
>(undefined);

export function useContextMenu(): ContextMenuController {
  const controller = React.useContext(ContextMenuControllerContext);
  return assertNonNull(controller);
}

export const ContextMenuProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [controller] = useState(() => new ContextMenuController());

  const [options, setOptions] = useState<readonly MenuItem[]>([]);
  const [indexPath, setIndexPath] = useState<readonly number[] | undefined>(
    undefined
  );
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const onChange = () => {
      setOptions(controller.options);
      setIndexPath(controller.indexPath);
      setLeft(controller.x);
      setTop(controller.y);
    };
    controller.on("change", onChange);
    return () => {
      controller.off("change", onChange);
    };
  }, [controller]);

  return (
    <ContextMenuControllerContext.Provider value={controller}>
      <ContextMenu
        options={options}
        indexPath={indexPath}
        x={left}
        y={top}
        onChangeIndexPath={(indexPath) =>
          controller.onChangeIndexPath(indexPath)
        }
      />
      {children}
    </ContextMenuControllerContext.Provider>
  );
};
