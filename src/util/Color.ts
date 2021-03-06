import * as CSSValue from "@seanchas116/cssvalue";
import cssColorNames from "css-color-names";
import colorNamer from "color-namer";
import parseCSSColor from "parse-css-color";
import { isNearEqual } from "./Math";
import { assertNonNull } from "./Assert";

export function normalizeHexString(hex: string): string {
  if (/^#?[0-9a-fA-F]{1,2}$/.exec(hex)) {
    const s = hex.replace("#", "");
    return "#" + s + s + s;
  }
  if (/^[0-9a-fA-F]{3,}$/.exec(hex)) {
    return "#" + hex;
  }
  return hex;
}

export class Color {
  constructor(opts: { h: number; s: number; v: number; a?: number }) {
    this.h = opts.h;
    this.s = opts.s;
    this.v = opts.v;
    this.a = opts.a ?? 1;
  }

  static fromCSSValue(color: CSSValue.Color): Color {
    if (color instanceof CSSValue.HexColor) {
      return assertNonNull(this.fromCSS(color.value));
    }
    if (color instanceof CSSValue.NamedColor) {
      return assertNonNull(this.fromCSS(color.value));
    }
    if (color instanceof CSSValue.RGBColor) {
      return new Color({ ...rgb2hsv(color), a: color.a });
    }
    if (color instanceof CSSValue.HSLColor) {
      return new Color({ ...hsl2hsv(color), a: color.a });
    }

    throw new Error("invalid color");
  }

  static get white(): Color {
    return new Color({ h: 0, s: 0, v: 1 });
  }
  static get black(): Color {
    return new Color({ h: 0, s: 0, v: 0 });
  }

  static rgb(rgb: { r: number; g: number; b: number; a?: number }): Color {
    return new Color({ ...rgb2hsv(rgb), a: rgb.a });
  }
  static hsl(hsl: { h: number; s: number; l: number; a?: number }): Color {
    return new Color({ ...hsl2hsv(hsl), a: hsl.a });
  }

  static fromName(name: keyof typeof cssColorNames): Color {
    return this.fromCSS(name)!;
  }

  /**
   * Creates a Color from a CSS color string.
   */
  static fromCSS(str: string): Color | undefined {
    const color = parseCSSColor(str);
    if (color) {
      if (color.type === "rgb") {
        return Color.rgb({
          r: color.values[0] / 255,
          g: color.values[1] / 255,
          b: color.values[2] / 255,
          a: color.alpha,
        });
      } else if (color.type === "hsl") {
        return Color.hsl({
          h: color.values[0] / 360,
          s: color.values[1] / 100,
          l: color.values[2] / 100,
          a: color.alpha,
        });
      }
    }
  }

  /**
   * Creates a Color from a color string.
   * Unlike `fromCSS`, this function also accepts hex-like strings that is invalid in CSS (f00, a, etc.).
   */
  static from(str: string): Color | undefined {
    return this.fromCSS(normalizeHexString(str));
  }

  static mix(color0: Color, color1: Color, ratio: number): Color {
    const rgb0 = color0.rgb;
    const rgb1 = color1.rgb;

    const r = rgb0.r * (1 - ratio) + rgb1.r * ratio;
    const g = rgb0.g * (1 - ratio) + rgb1.g * ratio;
    const b = rgb0.b * (1 - ratio) + rgb1.b * ratio;
    const a = rgb0.a * (1 - ratio) + rgb1.a * ratio;

    return new Color({ ...rgb2hsv({ r, g, b }), a });
  }

  readonly h: number;
  readonly s: number;
  readonly v: number;
  readonly a: number;

  toHex6(): string {
    const { r, g, b } = this.rgb;
    return (
      "#" +
      [r, g, b]
        .map((c) => {
          const str = Math.round(c * 255)
            .toString(16)
            .toUpperCase();
          return str.length === 1 ? "0" + str : str;
        })
        .join("")
    );
  }

  toHex8(): string {
    const { r, g, b, a } = this.rgb;
    return (
      "#" +
      [r, g, b, a]
        .map((c) => {
          const str = Math.round(c * 255)
            .toString(16)
            .toUpperCase();
          return str.length === 1 ? "0" + str : str;
        })
        .join("")
    );
  }

  toHex(): string {
    if (this.a > 0.999) {
      return this.toHex6();
    } else {
      return this.toHex8();
    }
  }

  toCSSValue(): CSSValue.HexColor {
    return new CSSValue.HexColor(this.toHex());
  }

  toString(): string {
    return this.toHex();
  }

  getName(): string {
    return colorNamer(this.toHex6()).pantone[0].name;
  }

  isEqual(other: Color): boolean {
    return (
      isNearEqual(this.h, other.h, 0.001) &&
      isNearEqual(this.s, other.s, 0.001) &&
      isNearEqual(this.v, other.v, 0.001) &&
      isNearEqual(this.a, other.a, 0.001)
    );
  }

  get rgb(): { r: number; g: number; b: number; a: number } {
    return { ...hsv2rgb(this), a: this.a };
  }
  get hsl(): { h: number; s: number; l: number; a: number } {
    return { ...hsv2hsl(this), a: this.a };
  }

  withAlpha(a: number): Color {
    return new Color({ ...this, a });
  }
}

// https://stackoverflow.com/a/54116681
function hsl2hsv({ h, s, l }: { h: number; s: number; l: number }): {
  h: number;
  s: number;
  v: number;
} {
  const v = s * Math.min(l, 1 - l) + l;
  return { h, s: v ? 2 - (2 * l) / v : 0, v };
}

function hsv2hsl({ h, s, v }: { h: number; s: number; v: number }): {
  h: number;
  s: number;
  l: number;
} {
  const l = v - (v * s) / 2;
  const m = Math.min(l, 1 - l);
  return { h, s: m ? (v - l) / m : 0, l };
}

// https://stackoverflow.com/a/54024653
function hsv2rgb({ h, s, v }: { h: number; s: number; v: number }): {
  r: number;
  g: number;
  b: number;
} {
  const f = (n: number, k = (n + h * 6) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return { r: f(5), g: f(3), b: f(1) };
}

// https://stackoverflow.com/a/54070620
function rgb2hsv({ r, g, b }: { r: number; g: number; b: number }): {
  h: number;
  s: number;
  v: number;
} {
  const v = Math.max(r, g, b),
    c = v - Math.min(r, g, b);
  const h =
    c && (v === r ? (g - b) / c : v === g ? 2 + (b - r) / c : 4 + (r - g) / c);
  return { h: (h < 0 ? h + 6 : h) / 6, s: v && c / v, v };
}
