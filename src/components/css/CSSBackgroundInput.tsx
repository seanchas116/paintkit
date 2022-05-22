import React from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react/dist/offline";
import { BackgroundLayerOrColor } from "../../util/BackgroundLayer";
import { MIXED } from "../../util/Mixed";
import { colors } from "../Palette";
import imageFillIcon from "../../icon/Image";
import { SelectItem } from "../Select";
import { PopoverComboBox } from "../PopoverComboBox";
import { replaceCSSURLs, replaceCSSVariables } from "../../util/CSS";
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
  options?: readonly SelectItem[];
  imageURLOptions?: readonly SelectItem[];
  resolveImageURL?: (url: string) => string;
  resolveCSSVariable?: (varName: string) => string;
  value?: string | typeof MIXED;
  onChange?: (value?: string) => void;
  onChangeEnd?: () => void;
}> = ({
  className,
  defaultPlacement,
  title,
  placeholder,
  options,
  imageURLOptions,
  resolveImageURL,
  resolveCSSVariable = () => "black",
  value,
  onChange,
  onChangeEnd,
}) => {
  const bgLayer = (() => {
    try {
      return typeof value === "string"
        ? BackgroundLayerOrColor.fromString(
            replaceCSSVariables(value, resolveCSSVariable)
          )
        : typeof placeholder === "string"
        ? BackgroundLayerOrColor.fromString(
            replaceCSSVariables(placeholder, resolveCSSVariable)
          )
        : undefined;
    } catch (e) {
      return undefined;
    }
  })();

  return (
    <PopoverComboBox
      className={className}
      value={value}
      title={title}
      placeholder={placeholder}
      options={options}
      defaultPlacement={defaultPlacement}
      onChange={(value) => {
        onChange?.(value);
        onChangeEnd?.();
        return true;
      }}
      renderButton={() =>
        value ? (
          <ColorButtonColor
            style={{
              background:
                typeof value === "string"
                  ? replaceCSSVariables(
                      replaceCSSURLs(
                        value,
                        resolveImageURL ?? ((url: string) => url)
                      ),
                      resolveCSSVariable
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
