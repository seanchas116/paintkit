import React, { createRef } from "react";
import styled from "styled-components";
import { popoverZIndex } from "./Common";
import { RootPortal } from "./RootPortal";

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

  display: none;
`;

export const PopoverCaster: React.FC<{
  anchor: (open: (anchor: DOMRect) => void) => JSX.Element;
  popover: (close: () => void) => JSX.Element;
}> = ({ anchor, popover }) => {
  const onOpen = (anchorRect: DOMRect) => {
    if (!wrapRef.current || !areaRef.current) {
      return;
    }

    areaRef.current.style.display = "block";

    const width = wrapRef.current.children[0].clientWidth;
    const height = wrapRef.current.children[0].clientHeight;
    if (window.innerHeight - anchorRect.bottom < height) {
      // show popover on top
      wrapRef.current.style.bottom = `${window.innerHeight - anchorRect.top}px`;
    } else {
      // show popover on bottom
      wrapRef.current.style.top = `${anchorRect.bottom}px`;
    }
    const xExcess = anchorRect.left + width - window.innerWidth;
    wrapRef.current.style.left = `${anchorRect.left - Math.max(xExcess, 0)}px`;
    wrapRef.current.style.visibility = "visible";
  };

  const onClose = () => {
    if (!wrapRef.current || !areaRef.current) {
      return;
    }
    areaRef.current.style.display = "none";
    wrapRef.current.style.visibility = "hidden";
  };

  const areaRef = createRef<HTMLDivElement>();
  const wrapRef = createRef<HTMLDivElement>();

  return (
    <>
      {anchor(onOpen)}
      <RootPortal>
        <PopoverArea ref={areaRef}>
          <PopoverBackground onClick={onClose} />
          <PopoverWrap ref={wrapRef}>{popover(onClose)}</PopoverWrap>
        </PopoverArea>
      </RootPortal>
    </>
  );
};
