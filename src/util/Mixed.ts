import { isEqual } from "lodash-es";

export const MIXED = Symbol("mixed");

export function sameOrMixed<T>(
  values: readonly T[]
): undefined | T | typeof MIXED {
  if (!values.length) {
    return undefined;
  }
  if (values.some((v) => !isEqual(v, values[0]))) {
    return MIXED;
  }
  return values[0];
}
