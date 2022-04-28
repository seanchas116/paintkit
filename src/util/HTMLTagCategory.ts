import voidHtmlTags from "html-tags/void";

export const voidElementTagNames = voidHtmlTags;

export function isVoidElement(tagName: string): boolean {
  return voidElementTagNames.includes(
    tagName as typeof voidElementTagNames[number]
  );
}

export const nonVisualElementTagNames = Object.freeze([
  "base",
  "command",
  "link",
  "meta",
  "noscript",
  "script",
  "style",
  "title",
  "head",
  "template",
] as const);

export function isNonVisualElement(tagName: string): boolean {
  return (nonVisualElementTagNames as readonly string[]).includes(tagName);
}

export const replacedElementTagNames = Object.freeze([
  "iframe",
  "video",
  "embed",
  "img",
  "option",
  "audio",
  "canvas",
  "object",
  "applet",
] as const);

export function isReplacedElement(tagName: string): boolean {
  return (replacedElementTagNames as readonly string[]).includes(tagName);
}
