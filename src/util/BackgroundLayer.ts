import * as bnb from "bread-n-butter";
import * as CSSValue from "@seanchas116/cssvalue";
import { Color } from "./Color";
import { LinearGradient } from "./Gradient";

export class ImageURL {
  constructor(url: string) {
    this.url = url;
  }

  readonly url: string;

  toCSSValue(): CSSValue.URL {
    return new CSSValue.URL(this.url);
  }
}

export class BackgroundLayer {
  constructor(options: {
    image: ImageURL | LinearGradient;
    position?: CSSValue.Position;
    size?: CSSValue.BackgroundSize;
    repeatStyle?: CSSValue.RepeatStyle;
  }) {
    const withDefaults = { ...new CSSValue.BackgroundLayer({}), ...options };

    this.image = withDefaults.image;
    this.position = withDefaults.position;
    this.size = withDefaults.size;
    this.repeatStyle = withDefaults.repeatStyle;
  }

  static fromCSSValue(
    cssValue: CSSValue.BackgroundLayer
  ): BackgroundLayer | undefined {
    if (!cssValue.image || cssValue.image instanceof CSSValue.RadialGradient) {
      // TODO: Support RadialGradient
      return undefined;
    }

    return new BackgroundLayer({
      ...cssValue,
      image:
        cssValue.image instanceof CSSValue.URL
          ? new ImageURL(cssValue.image.url)
          : LinearGradient.fromCSSValue(cssValue.image),
    });
  }

  static fromString(str: string): BackgroundLayer | undefined {
    return this.fromCSSValue(CSSValue.cssParser.bgLayer.tryParse(str));
  }

  readonly image: ImageURL | LinearGradient;
  readonly position: CSSValue.Position;
  readonly size: CSSValue.BackgroundSize;
  readonly repeatStyle: CSSValue.RepeatStyle;

  toCSSValue(): CSSValue.BackgroundLayer {
    return new CSSValue.BackgroundLayer({
      ...this,
      image: this.image.toCSSValue(),
    });
  }
}

export type BackgroundLayerOrColor = BackgroundLayer | Color;

export const BackgroundLayerOrColor = {
  fromString(str: string): BackgroundLayerOrColor | undefined {
    const parsed = bnb
      .choice(CSSValue.cssParser.bgLayer, CSSValue.cssParser.color)
      .tryParse(str);
    if (parsed instanceof CSSValue.BackgroundLayer) {
      return BackgroundLayer.fromCSSValue(parsed);
    } else {
      return Color.fromCSSValue(parsed);
    }
  },
};
