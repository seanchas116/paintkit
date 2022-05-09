import React, { useState, useEffect } from "react";
import styled from "styled-components";
import closeIcon from "@iconify-icons/ic/outline-close";
import Tippy from "@tippyjs/react";
import solidIcon from "../../icon/SolidRect";
import linearGradientIcon from "../../icon/LinearGradientRect";
import imageFillIcon from "../../icon/Image";
import {
  BackgroundLayer,
  BackgroundLayerOrColor,
} from "../../util/BackgroundLayer";
import { LinearGradient } from "../../util/Gradient";
import { IconButton } from "../IconButton";
import { LinearGradientPicker } from "../color/LinearGradientPicker";
import { BackgroundImagePicker } from "../color/BackgroundImagePicker";
import { SelectItem } from "../Select";
import { Color } from "../../util/Color";
import { ColorPicker } from "../color/ColorPicker";

const TabButtons = styled.div`
  display: flex;
  padding: 8px;
`;

const CSSBackgroundPickerWrap = styled.div`
  > :nth-child(2) {
    margin-top: -8px;
  }
`;

type ValueWithType =
  | {
      type: "color";
      value: Color;
    }
  | {
      type: "linearGradient";
      value: LinearGradient;
    }
  | {
      type: "image";
      value: BackgroundLayer;
    }
  | {
      type: "none";
    };

export const CSSBackgroundPicker: React.FC<{
  className?: string;
  value?: BackgroundLayerOrColor;
  imageURLOptions?: SelectItem[];
  resolveImageURL?: (url: string) => string;
  onChange?: (value?: BackgroundLayer | Color) => void;
  onChangeEnd?: () => void;
}> = ({
  className,
  value,
  imageURLOptions,
  resolveImageURL,
  onChange,
  onChangeEnd,
}) => {
  let valueWithType: ValueWithType;

  if (!value) {
    valueWithType = { type: "none" };
  } else if (value instanceof Color) {
    valueWithType = {
      type: "color",
      value,
    };
  } else {
    if (value?.image instanceof LinearGradient) {
      valueWithType = {
        type: "linearGradient",
        value: value.image,
      };
    } else {
      valueWithType = {
        type: "image",
        value,
      };
    }
  }

  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (valueWithType.type !== "linearGradient") {
      setIndex(0);
    }
  }, [valueWithType, setIndex]);

  return (
    <CSSBackgroundPickerWrap className={className}>
      <TabButtons>
        <Tippy content="None">
          <IconButton
            icon={closeIcon}
            pressed={valueWithType.type === "none"}
            onClick={() => {
              onChange?.(undefined);
              onChangeEnd?.();
            }}
          />
        </Tippy>
        <Tippy content="Color">
          <IconButton
            icon={solidIcon}
            pressed={valueWithType.type === "color"}
            onClick={() => {
              onChange?.(Color.from("gray"));
              onChangeEnd?.();
            }}
          />
        </Tippy>
        <Tippy content="Linear Gradient">
          <IconButton
            icon={linearGradientIcon}
            pressed={valueWithType.type === "linearGradient"}
            onClick={() => {
              onChange?.(
                BackgroundLayer.fromString("linear-gradient(white, red)")
              );
              onChangeEnd?.();
            }}
          />
        </Tippy>
        <Tippy content="Image">
          <IconButton
            pressed={valueWithType.type === "image"}
            icon={imageFillIcon}
            onClick={() => {
              onChange?.(
                BackgroundLayer.fromString("url(https://picsum.photos/100)")
              );
              onChangeEnd?.();
            }}
          />
        </Tippy>
      </TabButtons>
      {valueWithType.type === "color" && (
        <ColorPicker
          color={valueWithType.value}
          onChange={(value) => {
            onChange?.(value);
          }}
          onChangeEnd={onChangeEnd}
        />
      )}
      {valueWithType.type === "linearGradient" && (
        <LinearGradientPicker
          value={valueWithType.value}
          index={index}
          onChange={(gradient) => {
            onChange?.(new BackgroundLayer({ image: gradient }));
          }}
          onChangeEnd={onChangeEnd}
          onIndexChange={setIndex}
        />
      )}
      {valueWithType.type === "image" && (
        <BackgroundImagePicker
          value={valueWithType.value}
          imageURLOptions={imageURLOptions}
          resolveImageURL={resolveImageURL}
          onChange={(image) => {
            onChange?.(image);
            onChangeEnd?.();
          }}
        />
      )}
    </CSSBackgroundPickerWrap>
  );
};
