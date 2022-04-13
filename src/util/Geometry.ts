import { Rect } from "paintvec";

// TODO: Add an API to paintvec
export function roundRectXYWH(rect: Rect): Rect {
  return Rect.from({
    left: Math.round(rect.left),
    top: Math.round(rect.top),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  });
}

export function overlaps(axis: "x" | "y", ...rects: Rect[]): boolean {
  const max = Math.min(...rects.map((r) => r.bottomRight[axis]));
  const min = Math.max(...rects.map((r) => r.topLeft[axis]));
  return min < max;
}
