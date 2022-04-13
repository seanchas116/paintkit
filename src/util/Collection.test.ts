import { divideIntToArray } from "./Collection";

describe(divideIntToArray, () => {
  it("", () => {
    const result = divideIntToArray(33, 5);
    expect(result).toEqual([7, 7, 7, 6, 6]);
  });
});
