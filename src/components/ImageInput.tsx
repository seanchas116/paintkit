import React from "react";
import styled, { css } from "styled-components";
import { sameOrMixed } from "../util/Mixed";
import { ComboBox } from "./ComboBox";
import { checkPattern } from "./Common";
import { colors } from "./Palette";
import { SelectItem } from "./Select";

export const ImagePreviewWrap = styled.div<{ dropping?: boolean }>`
  width: 100%;
  height: 160px;
  border-radius: 4px;
  border: 1px solid ${colors.separator};
  ${checkPattern("white", "#eee", "16px")}
  ${(p) =>
    p.dropping &&
    css`
      border-color: ${colors.active};
    `}

  :focus {
    border-color: ${colors.active};
  }
`;

export const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
`;

const ImageInputWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ImageInput: React.VFC<{
  values: (string | undefined)[];
  onChange: (value: string) => boolean;
  resolveURL?: (url: string) => string;
  urlOptions?: SelectItem[];
  onPreviewContextMenu?: (e: React.MouseEvent) => void;
}> = ({
  values,
  onChange,
  resolveURL = (url) => url,
  urlOptions = [],
  onPreviewContextMenu,
}) => {
  const src = sameOrMixed(values);

  return (
    <ImageInputWrap>
      <ImagePreviewWrap tabIndex={-1} onContextMenu={onPreviewContextMenu}>
        <ImagePreview src={src ? resolveURL(src.toString()) : undefined} />
      </ImagePreviewWrap>
      <ComboBox value={src} options={urlOptions} onChange={onChange} />
    </ImageInputWrap>
  );
};
