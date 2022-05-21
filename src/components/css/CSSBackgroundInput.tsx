import React from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react/dist/offline";
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import replaceCSSURL from "replace-css-url";
import { BackgroundLayerOrColor } from "../../util/BackgroundLayer";
import { MIXED } from "../../util/Mixed";
import { colors } from "../Palette";
import imageFillIcon from "../../icon/Image";
import { SelectItem } from "../Select";
import { PopoverInput } from "../PopoverInput";
import { CSSBackgroundPicker } from "./CSSBackgroundPicker";

const ColorButtonColor = styled.div`
  width: 12px;
  height: 12px;
  background: currentColor;
  border-radius: 2px;
  box-shadow: 0 0 0 1px ${colors.popoverBorder};
`;

// TODO: support multiple image layers
export const CSSBackgroundInput: React.FC<{
  className?: string;
  defaultPlacement?: "top" | "bottom";
  title?: string;
  placeholder?: string;
  imageURLOptions?: SelectItem[];
  resolveImageURL?: (url: string) => string;
  value?: string | typeof MIXED;
  onChange?: (value?: string) => void;
  onChangeEnd?: () => void;
}> = ({
  className,
  defaultPlacement,
  title,
  placeholder,
  imageURLOptions,
  resolveImageURL,
  value,
  onChange,
  onChangeEnd,
}) => {
  const bgLayer = (() => {
    try {
      return typeof value === "string"
        ? BackgroundLayerOrColor.fromString(value)
        : undefined;
    } catch (e) {
      return undefined;
    }
  })();

  return (
    <PopoverInput
      className={className}
      value={value}
      title={title}
      placeholder={placeholder}
      defaultPlacement={defaultPlacement}
      onChange={(value) => {
        onChange?.(value);
        onChangeEnd?.();
        return true;
      }}
      renderButton={() =>
        bgLayer ? (
          <ColorButtonColor
            style={{
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              background:
                typeof value === "string"
                  ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    replaceCSSURL(
                      value,
                      resolveImageURL ?? ((url: string) => url)
                    )
                  : "none",
            }}
          />
        ) : (
          <Icon
            style={{
              color: colors.disabledText,
            }}
            icon={imageFillIcon}
          />
        )
      }
      renderPopover={() => (
        <CSSBackgroundPicker
          value={bgLayer}
          imageURLOptions={imageURLOptions}
          resolveImageURL={resolveImageURL}
          onChange={(value) => {
            onChange?.(value?.toCSSValue().toString() ?? "none");
          }}
          onChangeEnd={() => {
            onChangeEnd?.();
          }}
        />
      )}
    />
  );
};
