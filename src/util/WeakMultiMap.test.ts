import { describe, it, expect } from "vitest";
import { WeakMultiMap } from "./WeakMultiMap";

const obj1 = {};
const obj2 = {};
const obj3 = {};

const createMap = () => {
  const multimap = new WeakMultiMap();
  multimap.set(obj1, "foo");
  multimap.set(obj1, "bar");
  multimap.set(obj2, "hoge");
  multimap.set(obj3, "poyo");
  return multimap;
};

describe(WeakMultiMap.name, () => {
  describe("delete", () => {
    it("delete elements with specified key", () => {
      const multimap = createMap();
      expect(multimap.get(obj1)).toEqual(new Set(["foo", "bar"]));
      multimap.delete(obj1);
      expect(multimap.get(obj1)).toEqual(new Set());
    });
  });
  describe("get", () => {
    it("returns elements", () => {
      const multimap = createMap();
      expect(multimap.get(obj1)).toEqual(new Set(["foo", "bar"]));
    });
    it("returns empty set the MultiMap has no associated value", () => {
      const multimap = createMap();
      const obj4 = {};
      expect(multimap.get(obj4)).toEqual(new Set());
    });
  });
  describe("has", () => {
    it("returns if the MultiMap has any associated value", () => {
      const multimap = createMap();
      const obj4 = {};
      expect(multimap.has(obj1)).toEqual(true);
      expect(multimap.has(obj4)).toEqual(false);
      multimap.delete(obj1);
      expect(multimap.has(obj1)).toEqual(false);
    });
  });
});
