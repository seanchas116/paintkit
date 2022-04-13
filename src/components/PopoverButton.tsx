import React, { createRef, useEffect, useState } from "react";
import styled from "styled-components";
import { popoverZIndex } from "./Common";
import { RootPortal } from "./RootPortal";

const PopoverButtonWrap = styled.div`
  position: relative;
`;

const PopoverBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
`;

const PopoverWrap = styled.div`
  position: absolute;
  visibility: hidden;
`;

const PopoverArea = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: ${popoverZIndex};
`;

export const PopoverButton: React.FC<{
  className?: string;
  button: (open: boolean, toggleOpen: () => void) => JSX.Element;
  popover: (close: () => void) => JSX.Element;
  onOpen?: () => void;
  onClose?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}> = (props) => {
  const [open, setOpen] = useState(false);

  const onButtonClick = () => {
    if (open) {
      props.onClose?.();
      setOpen(false);
    } else {
      props.onOpen?.();
      setOpen(true);
    }
  };

  const rootRef = createRef<HTMLDivElement>();
  const wrapRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!wrapRef.current || !rootRef.current) {
      return;
    }

    const width = wrapRef.current.children[0].clientWidth;
    const height = wrapRef.current.children[0].clientHeight;
    const rootRect = rootRef.current.getBoundingClientRect();
    if (window.innerHeight - rootRect.bottom < height) {
      // show popover on top
      wrapRef.current.style.bottom = `${window.innerHeight - rootRect.top}px`;
    } else {
      // show popover on bottom
      wrapRef.current.style.top = `${rootRect.bottom}px`;
    }
    const xExcess = rootRect.left + width - window.innerWidth;
    wrapRef.current.style.left = `${rootRect.left - Math.max(xExcess, 0)}px`;
    wrapRef.current.style.visibility = "visible";
  }, [open]);

  return (
    <PopoverButtonWrap
      className={props.className}
      onContextMenu={props.onContextMenu}
      ref={rootRef}
    >
      {props.button(open, onButtonClick)}
      {open && (
        <RootPortal>
          <PopoverArea>
            <PopoverBackground
              onClick={() => {
                setOpen(false);
                props.onClose?.();
              }}
            />
            <PopoverWrap ref={wrapRef}>
              {props.popover(() => {
                setOpen(false);
                props.onClose?.();
              })}
            </PopoverWrap>
          </PopoverArea>
        </RootPortal>
      )}
    </PopoverButtonWrap>
  );
};
