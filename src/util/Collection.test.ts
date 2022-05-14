import { describe, it, expect } from "vitest";
import { divideIntToArray } from "./Collection";

describe(divideIntToArray.name, () => {
  it("", () => {
    const result = divideIntToArray(33, 5);
    expect(result).toEqual([7, 7, 7, 6, 6]);
  });
});
