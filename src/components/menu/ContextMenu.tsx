import { clamp } from "lodash-es";
import React, { createRef, useEffect } from "react";
import styled from "styled-components";
import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { popoverZIndex } from "../Common";
import { RootPortal } from "../RootPortal";
import { MenuItem } from "./Menu";
import { MenuList } from "./MenuBar";

const ContextMenuWrap = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: ${popoverZIndex};
`;

const ContextMenuBackground = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const ContextMenuPositioner = styled.div`
  position: absolute;
  opacity: 0;
`;

export const ContextMenu: React.FC<{
  options: readonly MenuItem[];
  indexPath?: readonly number[]; // [] to close context menu, [0] to open context menu
  x: number;
  y: number;
  onChangeIndexPath: (path: number[] | undefined) => void;
}> = ({ options, indexPath, x, y, onChangeIndexPath }) => {
  const isOpen = !!indexPath;

  const positionerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (isOpen) {
      const positioner = assertNonNull(positionerRef.current);
      const rect = positioner.getBoundingClientRect();

      const left = clamp(x, 0, window.innerWidth - Math.ceil(rect.width));
      const top = clamp(y, 0, window.innerHeight - Math.ceil(rect.height));

      positioner.style.left = `${left}px`;
      positioner.style.top = `${top}px`;
      positioner.style.opacity = "1";
    }
  }, [isOpen]);

  return isOpen ? (
    <RootPortal>
      <ContextMenuWrap>
        <ContextMenuBackground
          onClick={() => {
            onChangeIndexPath(undefined);
          }}
        />
        <ContextMenuPositioner ref={positionerRef}>
          <MenuList
            menu={{
              title: "",
              children: options,
            }}
            indexPath={indexPath}
            depth={0}
            onChangeIndexPath={(indexPath) =>
              onChangeIndexPath(indexPath.length ? indexPath : undefined)
            }
          />
        </ContextMenuPositioner>
      </ContextMenuWrap>
    </RootPortal>
  ) : null;
};
