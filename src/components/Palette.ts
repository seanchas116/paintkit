import { createGlobalStyle, css } from "styled-components";

export const opacities = {
  text: 1,
  icon: 0.9,
  label: 0.7,
  disabledText: 0.4,
};

export interface Palette {
  active: string;
  activeTransparent: string;
  red: string;
  component: string;
  componentTransparent: string;
  componentText: string;
  activeText: string;
  text: string;
  icon: string;
  label: string;
  disabledText: string;
  popoverBorder: string;
  uiBackground: string;
  separator: string;
  background: string;
}

export const darkPalette: Palette = {
  active: "#0085FF",
  activeTransparent: "#0085FF33",
  red: "#FF355C",
  component: "#7B61FF",
  componentTransparent: "#7B61FF33",
  componentText: "#C9BEFF",
  activeText: "rgba(255,255,255,1)",
  text: `rgba(255,255,255,${opacities.text})`,
  icon: `rgba(255,255,255,${opacities.icon})`,
  label: `rgba(255,255,255,${opacities.label})`,
  disabledText: `rgba(255,255,255,${opacities.disabledText})`,
  popoverBorder: "rgba(255,255,255,0.1)",
  uiBackground: "rgba(255,255,255,0.06)",
  separator: "rgba(255,255,255,0.04)",
  background: "var(--macaron-background, #222222)",
};

export const lightPalette: Palette = {
  active: "#2D96F6",
  activeTransparent: "#2D96F633",
  red: "#FF1744",
  component: "#7B61FF",
  componentTransparent: "#7B61FF33",
  componentText: "#7B61FF",
  activeText: "rgba(255,255,255,1)",
  text: `rgba(51,51,51,${opacities.text})`,
  icon: `rgba(51,51,51,${opacities.icon})`,
  label: `rgba(51,51,51,${opacities.label})`,
  disabledText: `rgba(51,51,51,${opacities.disabledText})`,
  popoverBorder: "rgba(51,51,51,0.1)",
  uiBackground: "rgba(51,51,51,0.06)",
  separator: "rgba(51,51,51,0.04)",
  background: "var(--macaron-background, #FFF)",
};

export const colors = Object.fromEntries(
  Object.keys(darkPalette).map((key) => [key, `var(--macaron-color-${key})`])
) as any as Palette;

function colorCSSVariablesString(colorValues: Readonly<Palette>): string {
  return Object.entries(colorValues)
    .map(([key, value]) => {
      return `--macaron-color-${key}: ${value};`;
    })
    .join("\n");
}

export const lightColorCSSVariables = colorCSSVariablesString(lightPalette);
export const darkColorCSSVariables = colorCSSVariablesString(darkPalette);

export const ColorsGlobalStyle = createGlobalStyle<{
  scheme: "auto" | "light" | "dark";
}>`
  body {
    ${({ scheme }) =>
      scheme === "auto"
        ? css`
            ${lightColorCSSVariables};
            @media (prefers-color-scheme: dark) {
              ${darkColorCSSVariables}
            }
          `
        : scheme === "light"
        ? lightColorCSSVariables
        : darkColorCSSVariables}
  }
`;
