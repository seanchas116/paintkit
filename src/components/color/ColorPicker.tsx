import React, { useState } from "react";
import styled from "styled-components";
import colorizeIcon from "@iconify-icons/ic/outline-colorize";
import { mod } from "../../util/Math";
import { Color } from "../../util/Color";
import { Input } from "../Input";
import { colors } from "../Palette";
import { IconButton } from "../IconButton";
import { checkPattern } from "../Common";
import { ColorSlider } from "./ColorSlider";
import { SVPicker } from "./SVPicker";

const InputsRowWrap = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr 1fr 1fr 1fr;
  gap: 4px;
`;

const InputColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 0;
  label {
    font-size: 10px;
    line-height: 10px;
    color: ${colors.label};
  }
`;

const PickerInput = styled(Input)`
  /* height: 20px; */
  min-width: 0;
  width: 100%;
  padding: 0;
  input {
    text-align: center;
  }
`;

type SliderMode = "rgb" | "hsv";

const InputsRow = ({
  color,
  onChange,
  onChangeEnd,
}: {
  color: Color;
  onChange?: (color: Color) => void;
  onChangeEnd?: (color: Color) => void;
}) => {
  const [mode, setMode] = useState<SliderMode>("hsv");

  const rgbColor = color.rgb;

  return (
    <InputsRowWrap>
      <InputColumn>
        <PickerInput
          value={color.toHex6()}
          onChange={(hexString) => {
            const newColor = Color.from(
              hexString[0] === "#" ? hexString : "#" + hexString
            );
            if (!newColor) {
              return false;
            }
            onChange?.(newColor);
            onChangeEnd?.(newColor);
            return true;
          }}
        />
        <label>Hex</label>
      </InputColumn>
      {mode === "hsv" ? (
        <>
          <InputColumn>
            <PickerInput
              value={Math.round(color.h * 360).toString()}
              onChange={(hString) => {
                const h = mod(Number.parseInt(hString) / 360, 1);
                const newColor = new Color({ ...color, h });
                onChange?.(newColor);
                onChangeEnd?.(newColor);
                return true;
              }}
            />
            <label onClick={() => setMode("rgb")}>H</label>
          </InputColumn>
          {(["s", "v"] as const).map((key) => {
            return (
              <InputColumn key={key}>
                <PickerInput
                  value={Math.round(color[key] * 100).toString()}
                  onChange={(valueString) => {
                    const value = mod(Number.parseInt(valueString) / 100, 1);
                    const newColor = new Color({ ...color, [key]: value });
                    onChange?.(newColor);
                    onChangeEnd?.(newColor);
                    return true;
                  }}
                />
                <label onClick={() => setMode("rgb")}>
                  {key.toUpperCase()}
                </label>
              </InputColumn>
            );
          })}
        </>
      ) : (
        <>
          {(["r", "g", "b"] as const).map((key) => {
            return (
              <InputColumn key={key}>
                <PickerInput
                  value={Math.round(rgbColor[key] * 255).toString()}
                  onChange={(valueString) => {
                    const value = mod(Number.parseInt(valueString) / 255, 1);
                    const newColor = Color.rgb({
                      ...rgbColor,
                      [key]: value,
                    });
                    onChange?.(newColor);
                    onChangeEnd?.(newColor);
                    return true;
                  }}
                />
                <label onClick={() => setMode("hsv")}>
                  {key.toUpperCase()}
                </label>
              </InputColumn>
            );
          })}
        </>
      )}

      <InputColumn>
        <PickerInput
          value={Math.round(color.a * 100).toString()}
          onChange={(aString) => {
            const a = mod(Number.parseInt(aString) / 100, 1);
            const newColor = new Color({ ...color, a });
            onChange?.(newColor);
            onChangeEnd?.(newColor);
            return true;
          }}
        />
        <label onClick={() => setMode(mode === "rgb" ? "hsv" : "rgb")}>A</label>
      </InputColumn>
    </InputsRowWrap>
  );
};

const ColorBox = styled.div`
  position: relative;
  overflow: hidden;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px inset rgba(0, 0, 0, 0.15);
  background-color: currentColor;

  &::before {
    content: "";

    z-index: -1;

    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    ${checkPattern("white", "#aaa", "8px")}
  }
`;

const ColorPickerWrap = styled.div`
  width: 224px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
`;

const SliderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Sliders = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ColorPicker: React.FC<{
  color: Color;
  onChange?: (color: Color) => void;
  onChangeEnd?: (color: Color) => void;
  className?: string;
}> = ({ color, onChange, onChangeEnd, className }) => {
  const opaqueColor = new Color({ ...color, a: 1 });

  return (
    <ColorPickerWrap className={className}>
      <SVPicker
        width={208}
        height={160}
        handleSize={12}
        color={opaqueColor}
        onChange={(opaqueColor) => {
          onChange?.(new Color({ ...opaqueColor, a: color.a }));
        }}
        onChangeEnd={(opaqueColor) => {
          onChangeEnd?.(new Color({ ...opaqueColor, a: color.a }));
        }}
      />
      <SliderRow>
        <Sliders>
          <ColorSlider
            direction="right"
            length={160}
            handleSize={12}
            railWidth={8}
            color={new Color({ h: color.h, s: 1, v: 1 }).toHex()}
            colorStops={[
              "#FF0000",
              "#FFFF00",
              "#00FF00",
              "#00FFFF",
              "#0000FF",
              "#FF00FF",
              "#FF0000",
            ]}
            value={color.h}
            onChange={(h) => {
              onChange?.(new Color({ ...color, h }));
            }}
            onChangeEnd={(h) => {
              onChangeEnd?.(new Color({ ...color, h }));
            }}
          />
          <ColorSlider
            direction="right"
            length={160}
            handleSize={12}
            railWidth={8}
            color={opaqueColor.toHex()}
            colorStops={[
              new Color({ ...color, a: 0 }).toHex(),
              new Color({ ...color, a: 1 }).toHex(),
            ]}
            value={color.a}
            onChange={(a) => {
              onChange?.(new Color({ ...color, a }));
            }}
            onChangeEnd={(a) => {
              onChangeEnd?.(new Color({ ...color, a }));
            }}
          />
        </Sliders>
        <IconButton icon={colorizeIcon} />
        <ColorBox style={{ color: color.toHex() }} />
      </SliderRow>
      <InputsRow color={color} onChange={onChange} onChangeEnd={onChangeEnd} />
    </ColorPickerWrap>
  );
};
