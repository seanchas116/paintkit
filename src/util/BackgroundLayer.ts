import * as CSSValue from "@seanchas116/cssvalue";
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
