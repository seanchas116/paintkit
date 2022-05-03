import React, { useState, useEffect } from "react";
import styled from "styled-components";
import closeIcon from "@iconify-icons/ic/outline-close";
import linearGradientIcon from "../../icon/LinearGradientRect";
import imageFillIcon from "../../icon/Image";
import { BackgroundLayer } from "../../util/BackgroundLayer";
import { LinearGradient } from "../../util/Gradient";
import { IconButton } from "../IconButton";
import { LinearGradientPicker } from "../color/LinearGradientPicker";
import { BackgroundImagePicker } from "../color/BackgroundImagePicker";

const TabButtons = styled.div`
  display: flex;
  padding: 8px;
`;

const CSSBackgroundImagePickerWrap = styled.div`
  > :nth-child(2) {
    margin-top: -8px;
  }
`;

export const CSSBackgroundImagePicker: React.FC<{
  className?: string;
  value?: BackgroundLayer;
  onChange?: (value?: BackgroundLayer) => void;
  onChangeEnd?: () => void;
}> = ({ className, value, onChange, onChangeEnd }) => {
  const linearGradient =
    value?.image instanceof LinearGradient ? value?.image : undefined;

  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!linearGradient) {
      setIndex(0);
    }
  }, [linearGradient, setIndex]);

  return (
    <CSSBackgroundImagePickerWrap className={className}>
      <TabButtons>
        <IconButton
          icon={closeIcon}
          pressed={!value}
          onClick={() => {
            onChange?.(undefined);
            onChangeEnd?.();
          }}
        />
        <IconButton
          icon={linearGradientIcon}
          pressed={!!linearGradient}
          onClick={() => {
            onChange?.(
              BackgroundLayer.fromString("linear-gradient(white, red)")
            );
            onChangeEnd?.();
          }}
        />
        <IconButton
          pressed={!linearGradient && !!value}
          icon={imageFillIcon}
          onClick={() => {
            onChange?.(
              BackgroundLayer.fromString("url(https://picsum.photos/100)")
            );
            onChangeEnd?.();
          }}
        />
      </TabButtons>
      {linearGradient && (
        <LinearGradientPicker
          value={linearGradient}
          index={index}
          onChange={(gradient) => {
            onChange?.(new BackgroundLayer({ image: gradient }));
          }}
          onChangeEnd={onChangeEnd}
          onIndexChange={setIndex}
        />
      )}
      {value && !linearGradient && (
        <BackgroundImagePicker
          value={value}
          onChange={(image) => {
            onChange?.(image);
            onChangeEnd?.();
          }}
        />
      )}
    </CSSBackgroundImagePickerWrap>
  );
};
