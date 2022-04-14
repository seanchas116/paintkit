import { clamp } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { usePointerStroke } from "../hooks/usePointerStroke";
import { colors } from "../Palette";

const VSplitterWrap = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  > :first-child {
    flex: var(--sidebarSplitRatio);
    flex-basis: 0;
    min-height: 0;
  }
  > :nth-child(3) {
    flex: calc(1 - var(--sidebarSplitRatio));
    flex-basis: 0;
    min-height: 0;
  }
`;

const VSplitBar = styled.div`
  height: 2px;
  background-color: ${colors.separator};
  position: relative;
`;

const VSplitHandle = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: -3px;
  height: 8px;
  z-index: 100;
  cursor: row-resize;
`;

export const VSplitter: React.FC<{
  className?: string;
  hidden?: boolean;
  children: React.ReactNode;
  ratio: number;
  onChangeRatio: (ratio: number) => void;
}> = ({ className, hidden, children, ratio, onChangeRatio }) => {
  const splittableRef = React.createRef<HTMLDivElement>();

  const childrenArray = React.Children.toArray(children);
  const first = childrenArray[0];
  const second = childrenArray[1];

  const handlePointerProps = usePointerStroke<Element, number>({
    onBegin: (e) => {
      e.preventDefault();
      e.stopPropagation();
      return ratio;
    },
    onMove: (e, { totalDeltaY, initData }) => {
      e.preventDefault();
      e.stopPropagation();

      const sideBarHeight = splittableRef.current?.clientHeight ?? 0;
      const ratioDelta = totalDeltaY / sideBarHeight;
      const ratio = clamp(initData + ratioDelta, 0.1, 0.9);
      onChangeRatio(ratio);
    },
  });

  return (
    <VSplitterWrap
      className={className}
      hidden={hidden}
      ref={splittableRef}
      style={{
        ["--sidebarSplitRatio" as keyof React.CSSProperties]: ratio,
      }}
    >
      {first}
      <VSplitBar>
        <VSplitHandle {...handlePointerProps} />
      </VSplitBar>
      {second}
    </VSplitterWrap>
  );
};
