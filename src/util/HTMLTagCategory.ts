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

const svgTagNames = [
  "svg",
  "animate",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tspan",
  "use",
  "view",
] as const;

export function isSVGTagName(tagName: string): boolean {
  return (svgTagNames as readonly string[]).includes(tagName);
}
