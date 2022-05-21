import { describe, expect, it } from "vitest";
import { replaceCSSVariables } from "./CSS";

describe(replaceCSSVariables.name, () => {
  it("should replace variables", () => {
    const css = `
      .test {
        color: var(--var1);
        background-color: var(--var2);
      }
    `;
    const expected = `
      .test {
        color: #aaa;
        background-color: #bbb;
      }
    `;

    const replacer = (variable: string) => {
      switch (variable) {
        case "--var1":
          return "#aaa";
        case "--var2":
          return "#bbb";
        default:
          return "";
      }
    };

    expect(replaceCSSVariables(css, replacer)).toEqual(expected);
  });
});
