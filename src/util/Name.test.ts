import { describe, it, expect } from "vitest";
import {
  getIncrementalUniqueName,
  incrementAlphanumeric,
  isValidJSIdentifier,
  toValidCSSIdentifier,
} from "./Name";

describe(incrementAlphanumeric.name, () => {
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

describe(getIncrementalUniqueName.name, () => {
  const existings = new Set(["foo", "bar1", "bar2"]);

  it("returns non-conflicting name based on incrementing", () => {
    expect(getIncrementalUniqueName(existings, "foo")).toEqual("foo1");
    expect(getIncrementalUniqueName(existings, "bar1")).toEqual("bar3");
    expect(getIncrementalUniqueName(existings, "bar2")).toEqual("bar3");
  });
});

describe(isValidJSIdentifier.name, () => {
  it("", () => {
    expect(isValidJSIdentifier("a123_$foo")).toEqual(true);
    expect(isValidJSIdentifier("foo, bar")).toEqual(false);
    expect(isValidJSIdentifier("instanceof")).toEqual(false);
    expect(isValidJSIdentifier("instanceofaaa")).toEqual(true);
  });
});

describe(toValidCSSIdentifier.name, () => {
  it("", () => {
    expect(toValidCSSIdentifier("")).toEqual("_");
    expect(toValidCSSIdentifier("foo bar baz")).toEqual("foo_bar_baz");
    expect(toValidCSSIdentifier("Foo Bar Baz")).toEqual("Foo_Bar_Baz");
    expect(toValidCSSIdentifier("123foo bar")).toEqual("_123foo_bar");
    expect(toValidCSSIdentifier("日本語でok")).toEqual("日本語でok");
  });
});
