export type ListDiff<T> =
  | { type: "insert"; value: T; before?: T }
  | { type: "remove"; value: T };

/**
 * Virtual DOM like diff algorhtim for arrays
 */
export function listDiff<T extends { key: unknown }>(
  before: readonly T[],
  after: readonly T[]
): ListDiff<T>[] {
  const existingKeys = new Set<unknown>(before.map((x) => x.key));

  const diffs: ListDiff<T>[] = [];

  let beforeIdx = 0;
  let afterIdx = 0;

  for (;;) {
    // insert rest of after
    if (beforeIdx === before.length) {
      for (; afterIdx < after.length; ++afterIdx) {
        diffs.push({
          type: "insert",
          value: after[afterIdx],
          before: undefined,
        });
      }
      break;
    }

    // remove rest of before
    if (afterIdx === after.length) {
      for (; beforeIdx < before.length; ++beforeIdx) {
        diffs.push({
          type: "remove",
          value: before[beforeIdx],
        });
      }
      break;
    }

    // same
    if (before[beforeIdx].key === after[afterIdx].key) {
      beforeIdx += 1;
      afterIdx += 1;
      continue;
    }

    if (existingKeys.has(after[afterIdx].key)) {
      // after item has existed -> probably before item is removed
      diffs.push({
        type: "remove",
        value: before[beforeIdx],
      });
      ++beforeIdx;
    } else {
      // after item is new -> probably after item is added
      diffs.push({
        type: "insert",
        value: after[afterIdx],
        before: before[beforeIdx],
      });
      ++afterIdx;
    }
  }

  return diffs;
}
