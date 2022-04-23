import {
  getIncrementalUniqueName,
  incrementAlphanumeric,
  isValidJSIdentifier,
  toIdentifier,
} from "./Name";

describe(incrementAlphanumeric, () => {
  it("add 0 if given string does not include number", () => {
    expect(incrementAlphanumeric("foobar")).toEqual("foobar1");
  });
  it("increment suffix 1 to 2", () => {
    expect(incrementAlphanumeric("foobar1")).toEqual("foobar2");
  });
  it("increment suffix numbers", () => {
    expect(incrementAlphanumeric("foobar9")).toEqual("foobar10");
    expect(incrementAlphanumeric("foobar10")).toEqual("foobar11");
    expect(incrementAlphanumeric("foobar123")).toEqual("foobar124");
    expect(incrementAlphanumeric("foobar999")).toEqual("foobar1000");
    expect(incrementAlphanumeric("foobar0999")).toEqual("foobar01000");
  });
});

describe(getIncrementalUniqueName, () => {
  const existings = new Set(["foo", "bar1", "bar2"]);

  it("returns non-conflicting name based on incrementing", () => {
    expect(getIncrementalUniqueName(existings, "foo")).toEqual("foo1");
    expect(getIncrementalUniqueName(existings, "bar1")).toEqual("bar3");
    expect(getIncrementalUniqueName(existings, "bar2")).toEqual("bar3");
  });
});

describe(isValidJSIdentifier, () => {
  it("", () => {
    expect(isValidJSIdentifier("a123_$foo")).toEqual(true);
    expect(isValidJSIdentifier("foo, bar")).toEqual(false);
    expect(isValidJSIdentifier("instanceof")).toEqual(false);
    expect(isValidJSIdentifier("instanceofaaa")).toEqual(true);
  });
});

describe(toIdentifier, () => {
  it("", () => {
    expect(toIdentifier("")).toEqual("_");
    expect(toIdentifier("foo-bar-baz")).toEqual("foo_bar_baz");
    expect(toIdentifier("123foo-bar")).toEqual("_123foo_bar");
    expect(toIdentifier("switch")).toEqual("switch_");
  });
});
