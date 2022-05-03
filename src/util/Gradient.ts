import { cloneDeep } from "lodash-es";
import * as CSSValue from "@seanchas116/cssvalue";
import { Color } from "./Color";

export class ColorStops {
  constructor(entries: [Color, number][]) {
    this.entries = entries.slice().sort((a, b) => a[1] - b[1]);
  }

  readonly entries: [Color, number][];

  clone(): ColorStops {
    return new ColorStops(cloneDeep(this.entries));
  }

  colorAt(pos: number): Color {
    for (let i = 0; i < this.entries.length; ++i) {
      if (pos < this.entries[i][1]) {
        if (i === 0) {
          const color = this.entries[0][0];
          if (!(color instanceof Color)) {
            throw new Error("cannot interpolate MacaronColors");
          }
          return color;
        }
        const prevColor = this.entries[i - 1][0];
        const nextColor = this.entries[i][0];
        if (!(prevColor instanceof Color) || !(nextColor instanceof Color)) {
          throw new Error("cannot interpolate MacaronColors");
        }

        const t =
          (pos - this.entries[i - 1][1]) /
          (this.entries[i][1] - this.entries[i - 1][1]);

        return Color.mix(prevColor, nextColor, t);
      }
    }

    const color = this.entries[this.entries.length - 1][0];
    if (!(color instanceof Color)) {
      throw new Error("cannot interpolate MacaronColors");
    }
    return color;
  }
}

export class LinearGradient {
  constructor(options: {
    stops: ColorStops;
    direction?: CSSValue.LinearGradient["direction"];
    repeating?: boolean;
  }) {
    this.stops = options.stops;
    this.direction = options.direction;
    this.repeating = options.repeating ?? false;
  }

  readonly stops: ColorStops;
  readonly direction: CSSValue.LinearGradient["direction"];
  readonly repeating: boolean;

  static fromCSSValue(cssValue: CSSValue.LinearGradient): LinearGradient {
    return new LinearGradient({
      ...cssValue,
      stops: new ColorStops(
        CSSValue.interpolateStops(cssValue.stops).map(([color, pos]) => [
          Color.fromCSSValue(color),
          pos,
        ])
      ),
    });
  }

  static fromString(str: string): LinearGradient {
    return this.fromCSSValue(CSSValue.cssParser.linearGradient.tryParse(str));
  }

  toCSSValue(): CSSValue.LinearGradient {
    return new CSSValue.LinearGradient({
      direction: this.direction,
      stops: this.stops.entries.map(
        ([color, pos]) =>
          new CSSValue.ColorStop({ color: color.toCSSValue(), position0: pos })
      ),
    });
  }

  toString(): string {
    return this.toCSSValue().toString();
  }
}
