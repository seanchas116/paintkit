import React, { useEffect } from "react";
import styled from "styled-components";
import { popoverZIndex } from "./Common";
import { colors } from "./Palette";
import { RootPortal } from "./RootPortal";

const ModalWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${popoverZIndex};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalBody = styled.div`
  position: relative;
  z-index: 1;
  display: flex;

  background-color: ${colors.background};
  border-radius: 8px;
  box-shadow: 0px 24px 38px rgba(0, 0, 0, 0.14),
    0px 9px 46px rgba(0, 0, 0, 0.12), 0px 11px 15px rgba(0, 0, 0, 0.2);
`;

export const Modal: React.VFC<{
  onClose: () => void;
  children?: React.ReactChild;
}> = function Modal({ onClose, children }) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  return (
    <RootPortal>
      <ModalWrap>
        <Background onClick={onClose} />
        <ModalBody>{children}</ModalBody>
      </ModalWrap>
    </RootPortal>
  );
};
