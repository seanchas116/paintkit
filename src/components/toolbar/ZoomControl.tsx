import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { action } from "mobx";
import Tippy from "@tippyjs/react";
import { Input } from "../Input";
import { MinusButton, PlusButton } from "../IconButton";

const ZoomControlWrap = styled.div`
  display: flex;
  height: 24px;
  align-items: center;
`;

const ZoomInput = styled(Input)`
  width: 40px;
  background: none;
  padding: 0;
  input {
    padding: 0;
    margin: 0;
    text-align: center;
  }
`;

export const ZoomControl: React.VFC<{
  className?: string;
  percentage: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onChangePercentage: (percentage: number) => void;
}> = observer(function ZoomControl({
  className,
  percentage,
  onZoomIn,
  onZoomOut,
  onChangePercentage,
}) {
  return (
    <ZoomControlWrap
      className={className}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <Tippy content="Zoom Out (-)">
        <MinusButton onClick={onZoomOut} />
      </Tippy>
      <ZoomInput
        value={`${percentage}%`}
        onChange={action((value) => {
          const newPercent = Number.parseFloat(value);
          if (isNaN(newPercent)) {
            return false;
          }
          onChangePercentage(newPercent);
          return true;
        })}
      />
      <Tippy content="Zoom In (+)">
        <PlusButton onClick={onZoomIn} />
      </Tippy>
    </ZoomControlWrap>
  );
});
