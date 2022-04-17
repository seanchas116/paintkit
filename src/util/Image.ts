import { Vec2 } from "paintvec";
import parse from "html-react-parser";
import React from "react";
import { IconifyIcon } from "@iconify/types";
import { iconToSVG } from "@iconify/utils";

// 1x1 PNG filled with rgba(255, 0, 0, 0.5)
export const emptyPNGDataURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

export function svgToDataURL(svgText: string): string {
  const encoded = encodeURIComponent(svgText)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

export function iconToDataURL(icon: IconifyIcon, defaultSize = 24): string {
  const { attributes, body } = iconToSVG(
    {
      body: icon.body,
      left: 0,
      top: 0,
      width: icon.width ?? defaultSize,
      height: icon.height ?? defaultSize,
      hFlip: icon.hFlip ?? false,
      vFlip: icon.vFlip ?? false,
      rotate: icon.rotate ?? 0,
    },
    {
      inline: false,
      width: null,
      height: null,
      hAlign: "center",
      vAlign: "middle",
      slice: false,
      hFlip: false,
      vFlip: false,
      rotate: 0,
    }
  );

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${attributes.viewBox}">${body}</svg>`;
  return svgToDataURL(svg);
}

export function intrinsicSizeForSVG(svgText: string): Vec2 {
  const svgElement = parse(svgText.trim());

  if (!React.isValidElement(svgElement) || svgElement.type !== "svg") {
    return new Vec2(0);
  }

  const { width, height } = svgElement.props as React.SVGProps<SVGSVGElement>;
  return new Vec2(Number(width ?? 0), Number(height ?? 0));
}
