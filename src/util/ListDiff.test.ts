import { describe, it, expect } from "vitest";
import { loremIpsum } from "lorem-ipsum";
import { listDiff, ListDiff } from "./ListDiff";

// Apply diff to normal array (warning: very slow)
function applyDiff(xs: { key: string }[], diffs: ListDiff<{ key: string }>[]) {
  const ret = xs.slice();

  for (const diff of diffs) {
    if (diff.type === "insert") {
      if (diff.before) {
        const i = ret.findIndex((x) => x.key === diff.before?.key);
        if (i < 0) {
          throw new Error("cannot find reference node");
        }
        ret.splice(i, 0, diff.value);
      } else {
        ret.push(diff.value);
      }
    } else {
      const i = ret.findIndex((x) => x.key === diff.value.key);
      ret.splice(i, 1);
    }
  }

  return ret;
}

describe(listDiff.name, () => {
  it("", () => {
    const a = ["a", "b", "c", "d"].map((key) => ({ key }));
    const b = ["a", "c", "d"].map((key) => ({ key }));

    const diffs = listDiff(a, b);
    const b2 = applyDiff(a, diffs);
    expect(b2).toEqual(b);

    expect(diffs).toMatchInlineSnapshot(`
      [
        {
          "type": "remove",
          "value": {
            "key": "b",
          },
        },
      ]
    `);
  });

  it("can do correct diff/patch in random texts", () => {
    for (let i = 0; i < 100; ++i) {
      const a = [...new Set(loremIpsum({ units: "words" }))].map((key) => ({
        key,
      }));
      const b = [...new Set(loremIpsum({ units: "words" }))].map((key) => ({
        key,
      }));
      const diffs = listDiff(a, b);
      const b2 = applyDiff(a, diffs);
      expect(b2.map((a) => a.key).join("")).toEqual(
        b.map((a) => a.key).join("")
      );
    }
  });

  it("", () => {
    const a = ["a", "b", "c", "d"].map((key) => ({ key }));
    const b = ["f", "b", "a", "d", "e"].map((key) => ({ key }));

    const diffs = listDiff(a, b);
    const b2 = applyDiff(a, diffs);
    expect(b2).toEqual(b);
    expect(diffs).toMatchInlineSnapshot(`
      [
        {
          "before": {
            "key": "a",
          },
          "type": "insert",
          "value": {
            "key": "f",
          },
        },
        {
          "type": "remove",
          "value": {
            "key": "a",
          },
        },
        {
          "type": "remove",
          "value": {
            "key": "c",
          },
        },
        {
          "type": "remove",
          "value": {
            "key": "d",
          },
        },
        {
          "before": undefined,
          "type": "insert",
          "value": {
            "key": "a",
          },
        },
        {
          "before": undefined,
          "type": "insert",
          "value": {
            "key": "d",
          },
        },
        {
          "before": undefined,
          "type": "insert",
          "value": {
            "key": "e",
          },
        },
      ]
    `);
  });
});
