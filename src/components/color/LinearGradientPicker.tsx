import React from "react";
import styled from "styled-components";
import { clamp, cloneDeep } from "lodash-es";
import * as CSSValue from "@seanchas116/cssvalue";
import { Icon } from "@iconify/react/dist/offline";
import angleIcon from "../../icon/Angle";
import { colors } from "../Palette";
import { Dimension, DimensionInput } from "../DimensionInput";
import { usePointerStroke } from "../hooks/usePointerStroke";
import { checkPattern } from "../Common";
import { ColorStops, LinearGradient } from "../../util/Gradient";
import { ColorPicker } from "./ColorPicker";
import { ColorHandle, createGradient } from "./ColorSlider";

const EditRow = styled.div`
  display: flex;
  align-items: center;
`;

const AngleIcon = styled(Icon).attrs({
  icon: angleIcon,
  width: 12,
  height: 12,
})`
  color: ${colors.disabledText};
  margin-right: 4px;
`;

const AngleInput = styled(DimensionInput)`
  width: 80px;
`;

const barWidth = 208;
const handleWidth = 12;

const GradientRow = styled.div`
  height: ${handleWidth}px;
  position: relative;
  z-index: 0;
`;

const GradientBarGradient = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: ${barWidth}px;
  height: ${handleWidth}px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 0 0 1px inset rgba(0, 0, 0, 0.15);

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
  &::after {
    content: "";

    z-index: -1;

    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    background: var(--gradient);
  }
`;

const GradientHandleWrap = styled(ColorHandle)<{ selected: boolean }>`
  position: absolute;
  top: 0;
  left: calc(var(--position) * ${barWidth - handleWidth}px);
  width: ${handleWidth}px;
  height: ${handleWidth}px;
  box-shadow: ${(p) =>
    p.selected
      ? `0 0 0 2px ${colors.active}`
      : "0 0 0 1px inset rgba(0, 0, 0, 0.4)"};
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid ${colors.separator};
`;

const LinearGradientPopoverWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const GradientHandle: React.FC<{
  color: string;
  position: number;
  selected: boolean;
  barWidth: number;
  onMoveBegin: () => void;
  onMove: (position: number) => void;
  onMoveEnd: () => void;
  onRemove: () => void;
}> = ({
  color,
  position,
  selected,
  barWidth,
  onMoveBegin,
  onMove,
  onMoveEnd,
  onRemove,
}) => {
  const pointerProps = usePointerStroke<Element, number>({
    onBegin: (e) => {
      onMoveBegin();
      return position;
    },
    onMove: (e, { initData, totalDeltaX }) => {
      onMove(initData + totalDeltaX / barWidth);
    },
    onEnd: (e) => {
      onMoveEnd();
    },
  });
  return (
    <GradientHandleWrap
      {...pointerProps}
      selected={selected}
      style={{ color, "--position": position } as never}
      onContextMenu={(e) => {
        e.preventDefault();
        onRemove();
      }}
    />
  );
};

export const LinearGradientPicker: React.FC<{
  className?: string;
  value: LinearGradient;
  //colorVariables?: ColorPopoverVariables;
  index: number;
  onChange?: (value: LinearGradient) => void;
  onChangeEnd?: () => void;
  onIndexChange?: (index: number) => void;
}> = ({
  className,
  value,
  //colorVariables,
  index,
  onChange,
  onChangeEnd,
  onIndexChange,
}) => {
  const stops = value.stops.entries;
  const currentIndex = clamp(index, 0, stops.length - 1);

  const currentColor = stops[currentIndex][0];

  return (
    <LinearGradientPopoverWrap className={className}>
      <Top>
        <EditRow>
          <AngleIcon />
          <AngleInput
            value={value.direction?.toString() || ""}
            units={["deg", "turn"]}
            placeholder={"180deg"}
            keywords={CSSValue.linearGradientDirectionKeywords}
            onChange={(str) => {
              const parsed = str ? Dimension.parse(str) : undefined;

              const direction = parsed
                ? "keyword" in parsed
                  ? (parsed.keyword as CSSValue.LinearGradientDirectionKeyword)
                  : new CSSValue.Dimension<CSSValue.AngleUnit>(
                      parsed.value,
                      parsed.unit as CSSValue.AngleUnit
                    )
                : undefined;

              onChange?.(
                new LinearGradient({
                  ...value,
                  direction: direction,
                })
              );
              onChangeEnd?.();
              return true;
            }}
          />
        </EditRow>
        <GradientRow>
          <GradientBarGradient
            style={
              {
                "--gradient": createGradient(
                  "right",
                  barWidth,
                  handleWidth,
                  stops.map(([color, pos]) => [color.toString(), pos])
                ),
              } as never
            }
            onClick={(e) => {
              const pos = clamp(
                (e.nativeEvent.offsetX - handleWidth / 2) /
                  (barWidth - handleWidth),
                0,
                1
              );
              let newIndex = stops.length;
              for (let i = 0; i < stops.length; ++i) {
                if (pos < stops[i][1]) {
                  newIndex = i;
                  break;
                }
              }
              const color = value.stops.colorAt(pos);

              const newStops = cloneDeep(stops);
              newStops.splice(newIndex, 0, [color, pos]);

              onChange?.(
                new LinearGradient({
                  ...value,
                  stops: new ColorStops(newStops),
                })
              );
              onChangeEnd?.();
              onIndexChange?.(newIndex);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          />
          {stops.map((stop, i) => {
            const nextPos = i < stops.length - 1 ? stops[i + 1][1] : 1;
            const prevPos = 1 <= i ? stops[i - 1][1] : 0;

            return (
              <GradientHandle
                selected={i === currentIndex}
                barWidth={barWidth - handleWidth}
                color={stop[0].toCSSValue().toString()}
                position={stop[1]}
                onMoveBegin={() => {
                  onIndexChange?.(i);
                }}
                onMove={(pos) => {
                  const newStops = cloneDeep(stops);
                  newStops[i][1] = clamp(pos, prevPos, nextPos);

                  onChange?.(
                    new LinearGradient({
                      ...value,
                      stops: new ColorStops(newStops),
                    })
                  );
                }}
                onMoveEnd={onChangeEnd || (() => {})}
                onRemove={() => {
                  if (stops.length <= 2) {
                    return;
                  }

                  const newStops = cloneDeep(stops);
                  newStops.splice(i, 1);
                  const newCurrentIndex = clamp(
                    0,
                    currentIndex,
                    newStops.length - 1
                  );
                  onChange?.(
                    new LinearGradient({
                      ...value,
                      stops: new ColorStops(newStops),
                    })
                  );
                  onChangeEnd?.();
                  onIndexChange?.(newCurrentIndex);
                }}
              />
            );
          })}
        </GradientRow>
      </Top>
      <ColorPicker
        color={currentColor}
        onChange={(color) => {
          const newStops = cloneDeep(stops);
          newStops[currentIndex][0] = color;

          onChange?.(
            new LinearGradient({
              ...value,
              stops: new ColorStops(newStops),
            })
          );
        }}
        onChangeEnd={onChangeEnd}
      />
    </LinearGradientPopoverWrap>
  );
};
