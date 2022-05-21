import React from "react";
import styled from "styled-components";
import * as CSSValue from "@seanchas116/cssvalue";
import { Label } from "../Label";
import { Select, SelectItem } from "../Select";
import { ImageInput } from "../ImageInput";
import { BackgroundLayer, ImageURL } from "../../util/BackgroundLayer";
import { DimensionInput } from "../DimensionInput";

const lengthPercentageAutoParser = CSSValue.cssParser.lengthPercentage.or(
  CSSValue.cssParser.keyword("auto")
);

const lengthPercentageUnits = ["px", "%", "em", "rem", "vw", "vh"];

const BackgroundImagePickerWrap = styled.div`
  width: 224px;
`;

const URLRow = styled.div`
  margin: 8px;
`;

const SizeRow = styled.div`
  margin: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 8px;
  row-gap: 4px;

  grid-template-areas:
    "a b ."
    ". c d";

  > *:nth-child(1) {
    grid-area: a;
  }
  > *:nth-child(2) {
    grid-area: b;
  }
  > *:nth-child(3) {
    grid-area: c;
  }
  > *:nth-child(4) {
    grid-area: d;
  }
`;

const PositionRow = styled.div`
  margin: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 8px;
  row-gap: 4px;

  grid-template-areas:
    "a b c"
    ". d e";

  > *:nth-child(1) {
    grid-area: a;
  }
  > *:nth-child(2) {
    grid-area: b;
  }
  > *:nth-child(3) {
    grid-area: c;
  }
  > *:nth-child(4) {
    grid-area: d;
  }
  > *:nth-child(5) {
    grid-area: e;
  }
`;

export const BackgroundImagePicker: React.FC<{
  className?: string;
  value: BackgroundLayer;
  imageURLOptions?: readonly SelectItem[];
  resolveImageURL?: (url: string) => string;
  onChange: (value: BackgroundLayer) => void;
}> = ({ className, value, imageURLOptions, resolveImageURL, onChange }) => {
  if (!(value.image instanceof ImageURL)) {
    return null;
  }

  const onURLChange = (url: string) => {
    onChange(new BackgroundLayer({ ...value, image: new ImageURL(url) }));
    return true;
  };

  return (
    <BackgroundImagePickerWrap className={className}>
      <URLRow>
        <ImageInput
          value={value.image.url}
          options={imageURLOptions}
          resolveURL={resolveImageURL}
          onChange={onURLChange}
        />
      </URLRow>
      <SizeRow>
        <Label>Size</Label>
        <Select
          value={typeof value.size === "string" ? value.size : undefined}
          options={[{ value: "cover" }, { value: "contain" }] as const}
          onChange={(size) => {
            const newValue = new BackgroundLayer({
              ...value,
              size,
            });
            onChange(newValue);
          }}
        />
        <DimensionInput
          value={
            typeof value.size === "object"
              ? value.size[0].toString()
              : undefined
          }
          units={lengthPercentageUnits}
          keywords={["auto"]}
          onChange={(sizeX) => {
            if (!sizeX) {
              return false;
            }

            const sizeY =
              typeof value.size === "object" ? value.size[1] : "auto";
            const newValue = new BackgroundLayer({
              ...value,
              size: [lengthPercentageAutoParser.tryParse(sizeX), sizeY],
            });
            onChange(newValue);
            return true;
          }}
        />
        <DimensionInput
          value={
            typeof value.size === "object"
              ? value.size[1].toString()
              : undefined
          }
          units={lengthPercentageUnits}
          keywords={["auto"]}
          onChange={(sizeY) => {
            if (!sizeY) {
              return false;
            }

            const sizeX =
              typeof value.size === "object" ? value.size[0] : "auto";
            const newValue = new BackgroundLayer({
              ...value,
              size: [sizeX, lengthPercentageAutoParser.tryParse(sizeY)],
            });
            onChange(newValue);
            return true;
          }}
        />
      </SizeRow>
      <PositionRow>
        <Label>Position</Label>
        <Select
          value={
            value.position.x === "center" ? "center" : value.position.x?.from
          }
          options={
            [
              { value: "left" },
              { value: "center" },
              { value: "right" },
            ] as const
          }
          onChange={(fromX) => {
            const newPos = new CSSValue.Position(
              fromX === "center"
                ? "center"
                : { from: fromX, offset: new CSSValue.Dimension(0, "") },
              value.position.y
            );
            const newValue = new BackgroundLayer({
              ...value,
              position: newPos,
            });
            onChange(newValue);
          }}
        />
        <Select
          value={
            value.position.y === "center" ? "center" : value.position.y?.from
          }
          options={
            [
              { value: "top" },
              { value: "center" },
              { value: "bottom" },
            ] as const
          }
          onChange={(fromY) => {
            const newPos = new CSSValue.Position(
              value.position.x,
              fromY === "center"
                ? "center"
                : { from: fromY, offset: new CSSValue.Dimension(0, "") }
            );
            const newValue = new BackgroundLayer({
              ...value,
              position: newPos,
            });
            onChange(newValue);
          }}
        />
        <DimensionInput
          disabled={value.position.x === "center"}
          value={
            typeof value.position.x === "object"
              ? value.position.x.offset.toString()
              : undefined
          }
          units={lengthPercentageUnits}
          keywords={[]}
          onChange={(offsetX) => {
            if (!offsetX) {
              return false;
            }
            if (typeof value.position.x !== "object") {
              return false;
            }
            const newPos = new CSSValue.Position(
              {
                from: value.position.x.from,
                offset: CSSValue.cssParser.lengthPercentage.tryParse(offsetX),
              },
              value.position.y
            );
            const newValue = new BackgroundLayer({
              ...value,
              position: newPos,
            });
            onChange(newValue);
            return true;
          }}
        />
        <DimensionInput
          disabled={value.position.x === "center"}
          value={
            typeof value.position.y === "object"
              ? value.position.y.offset.toString()
              : undefined
          }
          units={lengthPercentageUnits}
          keywords={[]}
          onChange={(offsetY) => {
            if (!offsetY) {
              return false;
            }
            if (typeof value.position.y !== "object") {
              return false;
            }
            const newPos = new CSSValue.Position(value.position.x, {
              from: value.position.y.from,
              offset: CSSValue.cssParser.lengthPercentage.tryParse(offsetY),
            });
            const newValue = new BackgroundLayer({
              ...value,
              position: newPos,
            });
            onChange(newValue);
            return true;
          }}
        />
      </PositionRow>
    </BackgroundImagePickerWrap>
  );
};
