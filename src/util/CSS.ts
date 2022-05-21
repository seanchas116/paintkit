// @ts-ignore
import replaceCSSURL from "replace-css-url";

export function replaceCSSURLs(
  css: string,
  replacer: (url: string) => string
): string {
  // eslint-disable-next-line
  return replaceCSSURL(css, replacer);
}

export function replaceCSSVariables(
  css: string,
  replacer: (variableName: string) => string
): string {
  return css.replace(
    /(var\()([^)]+)(\))/gi,
    (match, open: string, variable: string, close: string) => {
      return replacer(variable);
    }
  );
}
