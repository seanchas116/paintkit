import { toJS } from "mobx";
import { ObservableMultiMap } from "./ObservableMultiMap";

const createMap = () => {
  const multimap = new ObservableMultiMap();
  multimap.set(1, "foo");
  multimap.set(1, "bar");
  multimap.set(2, "hoge");
  multimap.set(3, "poyo");
  return multimap;
};

describe(ObservableMultiMap, () => {
  describe("clear", () => {
    it("clears elements", () => {
      const multimap = createMap();
      expect(multimap.map.size).toEqual(3);
      multimap.clear();
      expect(multimap.map.size).toEqual(0);
    });
  });
  describe("delete", () => {
    it("delete elements with specified key", () => {
      const multimap = createMap();
      expect(toJS(multimap.get(1))).toEqual(new Set(["foo", "bar"]));
      multimap.delete(1);
      expect(toJS(multimap.get(1))).toEqual(new Set());
    });
  });
  describe("get", () => {
    it("returns elements", () => {
      const multimap = createMap();
      expect(toJS(multimap.get(1))).toEqual(new Set(["foo", "bar"]));
    });
    it("returns empty set the MultiMap has no associated value", () => {
      const multimap = createMap();
      expect(toJS(multimap.get(5))).toEqual(new Set());
    });
  });
  describe("has", () => {
    it("returns if the MultiMap has any associated value", () => {
      const multimap = createMap();
      expect(toJS(multimap.has(1))).toEqual(true);
      expect(toJS(multimap.has(5))).toEqual(false);
      multimap.delete(1);
      expect(toJS(multimap.has(1))).toEqual(false);
    });
  });
  describe("[Symbol.iterator]", () => {
    it("makes MultiMap iterable", () => {
      const multimap = createMap();
      const iterated = Array.from(multimap).map((kv) => [kv[0], toJS(kv[1])]);
      // FIXME: It seems toJS doesn't work recursively
      // const iterated = toJS(Array.from(multimap))
      expect(iterated).toEqual([
        [1, new Set(["foo", "bar"])],
        [2, new Set(["hoge"])],
        [3, new Set(["poyo"])],
      ]);
    });
  });
});
