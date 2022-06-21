import React from "react";
import styled, { css } from "styled-components";
import mime from "mime-types";
import isSvg from "is-svg";
import uploadIcon from "@iconify-icons/ic/outline-upload";
import downloadIcon from "@iconify-icons/ic/outline-download";
import copyIcon from "@iconify-icons/ic/outline-content-copy";
import pasteIcon from "@iconify-icons/ic/outline-content-paste";
import Tippy from "@tippyjs/react";
import dataURIToBuffer from "data-uri-to-buffer";
import { blobToDataURL, imageToBlob } from "../util/Blob";
import { emptyPNGDataURL, svgToDataURL } from "../util/Image";
import { MIXED } from "../util/Mixed";
import { SelectItem } from "./Select";
import { TextRadio } from "./TextRadio";
import { IconButton } from "./IconButton";
import { colors } from "./Palette";
import { checkPattern } from "./Common";
import { ComboBox } from "./ComboBox";

export const ImagePreviewWrap = styled.div<{ dropping?: boolean }>`
  width: 100%;
  height: 160px;
  border-radius: 4px;
  border: 1px solid ${colors.uiBackground};
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

const ImagePreview = styled.img`
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

let showSaveDialog: (
  data: Buffer,
  extension: string
) => Promise<string | undefined> = async (data: Buffer, extension: string) => {
  const mimetype = mime.lookup(extension);
  if (!mimetype) {
    throw new Error(`Unsupported extension: ${extension}`);
  }
  const fileHandle = await showSaveFilePicker({
    types: [
      {
        description: extension,
        accept: {
          [mimetype]: [`.${extension}`],
        },
      },
    ],
  });

  const writable = await fileHandle.createWritable();
  await writable.write(data);
  await writable.close();

  return undefined;
};

export function setShowSaveDialog(
  fn: (data: Buffer, extension: string) => Promise<string | undefined>
): void {
  showSaveDialog = fn;
}

export const ImageInput: React.VFC<{
  className?: string;
  value?: string | typeof MIXED;
  onChange: (value: string) => boolean;
  resolveURL?: (url: string) => string;
  options?: readonly SelectItem[];
  onPreviewContextMenu?: (e: React.MouseEvent) => void;
}> = ({
  className,
  value,
  onChange,
  resolveURL = (url) => url,
  options = [],
  onPreviewContextMenu,
}) => {
  const previewWrapRef = React.createRef<HTMLDivElement>();

  const copyImage = async () => {
    if (!value || value === MIXED) {
      return;
    }

    if (value.startsWith("data:image/svg+xml")) {
      const buffer = dataURIToBuffer(value);
      await navigator.clipboard.writeText(buffer.toString("utf-8"));
      return;
    }

    const pngBlob = await imageToBlob(value);
    // @ts-ignore
    const item = new ClipboardItem({ "image/png": pngBlob });
    await navigator.clipboard.write([item]);
  };

  const pasteImage = async () => {
    for (const item of await navigator.clipboard.read()) {
      if (item.types.includes("text/plain")) {
        const text = await (await item.getType("text/plain")).text();
        if (isSvg(text)) {
          onChange(svgToDataURL(text));
          return;
        }
      }
      if (item.types.includes("image/png")) {
        const blob = await item.getType("image/png");
        const dataURL = await blobToDataURL(blob);
        onChange(dataURL);
        return;
      }
    }
  };

  // useEffect(() => {
  //   const preview = previewWrapRef.current;
  //   if (!preview) {
  //     return;
  //   }

  //   const mousetrap = new Mousetrap(preview);
  //   mousetrap.bind(
  //     ["ctrl+c", "command+c"],
  //     action((e) => {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       void copyImage();
  //     })
  //   );
  //   mousetrap.bind(
  //     ["ctrl+v", "command+v"],
  //     action((e) => {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       void pasteImage();
  //     })
  //   );
  // }, []);

  return (
    <ImageInputWrap className={className}>
      <ImagePreviewWrap
        tabIndex={-1}
        onContextMenu={onPreviewContextMenu}
        ref={previewWrapRef}
      >
        <ImagePreview src={value ? resolveURL(value.toString()) : undefined} />
      </ImagePreviewWrap>

      {typeof value === "string" && value.startsWith("data:") ? (
        <Buttons>
          <Tippy content="Load...">
            <IconButton
              icon={uploadIcon}
              onClick={async () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.click();
                input.addEventListener("change", async () => {
                  const file = Array.from(input.files ?? [])[0];
                  if (!file) {
                    return;
                  }
                  const dataURL = await blobToDataURL(file);
                  onChange(dataURL);
                });
              }}
            />
          </Tippy>
          <Tippy content="Save...">
            <IconButton
              icon={downloadIcon}
              onClick={async () => {
                if (!value) {
                  return;
                }

                const buffer = dataURIToBuffer(value);

                const ext = mime.extension(buffer.type);
                if (!ext) {
                  return;
                }

                const newURL = await showSaveDialog(buffer, ext);
                if (newURL) {
                  onChange(newURL);
                }

                // const fileHandle = await showSaveFilePicker({
                //   types: [
                //     {
                //       description: buffer.type,
                //       accept: {
                //         [buffer.type]: [`.${ext}`],
                //       },
                //     },
                //   ],
                // });

                // const writable = await fileHandle.createWritable();
                // await writable.write(dataURIToBuffer(src));
                // await writable.close();
              }}
            />
          </Tippy>
          <Tippy content="Copy">
            <IconButton icon={copyIcon} onClick={copyImage} />
          </Tippy>
          <Tippy content="Paste">
            <IconButton icon={pasteIcon} onClick={pasteImage} />
          </Tippy>
        </Buttons>
      ) : (
        <ComboBox
          options={options}
          placeholder="Image Path or URL"
          value={value}
          onChange={onChange}
        />
      )}

      <TextRadio
        options={[
          {
            value: "embedded",
            text: "Embedded",
          },
          {
            value: "file",
            text: "Image File",
          },
        ]}
        value={
          typeof value === "string" && value.startsWith("data:")
            ? "embedded"
            : "file"
        }
        onChange={async (newType) => {
          if (newType === "embedded") {
            try {
              if (typeof value === "string") {
                const response = await fetch(resolveURL(value));
                const blob = await response.blob();
                const content = await blobToDataURL(blob);
                onChange(content);
                return;
              }
            } catch {
              console.warn("failed to load image as data URL", value);
            }
            onChange(emptyPNGDataURL);
          } else {
            onChange("");
          }
        }}
      />
    </ImageInputWrap>
  );
};

const Buttons = styled.div`
  display: flex;
  gap: 4px;
  height: 24px;
  align-items: center;
`;
