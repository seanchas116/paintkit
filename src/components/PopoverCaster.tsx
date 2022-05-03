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
    const wrap = wrapRef.current;
    const area = areaRef.current;

    const setPosition = () => {
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      if (window.innerHeight - anchorRect.bottom < height) {
        // show popover on top
        wrap.style.bottom = `${window.innerHeight - anchorRect.top}px`;
        wrap.style.removeProperty("top");
      } else {
        // show popover on bottom
        wrap.style.top = `${anchorRect.bottom}px`;
        wrap.style.removeProperty("bottom");
      }
      const xExcess = anchorRect.left + width - window.innerWidth;
      wrap.style.left = `${anchorRect.left - Math.max(xExcess, 0)}px`;
    };

    area.style.display = "block";
    setPosition();
    wrap.style.visibility = "visible";
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
