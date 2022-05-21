// @ts-ignore
import replaceCSSURL from "replace-css-url";

export function replaceURLsInCSS(
  css: string,
  replacer: (url: string) => string
): string {
  // eslint-disable-next-line
  return replaceCSSURL(css, replacer);
}
