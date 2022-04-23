import { isEqual, isEmpty, omitBy } from "lodash-es";

export function sameOrNone<T>(values: readonly T[]): T | undefined {
  if (!values.length) {
    return undefined;
  }
  if (values.some((v) => !isEqual(v, values[0]))) {
    return undefined;
  }
  return values[0];
}

export function getOrSetDefault<K, V>(
  map: Map<K, V>,
  key: K,
  defaultValue: () => V
): V;
// eslint-disable-next-line @typescript-eslint/ban-types
export function getOrSetDefault<K extends object, V>(
  map: WeakMap<K, V>,
  key: K,
  defaultValue: () => V
): V;
export function getOrSetDefault<V>(
  map: Map<any, V> | WeakMap<any, V>,
  key: any,
  defaultValue: () => V
): V {
  let value = map.get(key);
  if (!value) {
    value = defaultValue();
    map.set(key, value);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return map.get(key)!;
  }
  return value;
}

type AbstractInstanceType<T> = T extends { prototype: infer U } ? U : never;

export function filterInstance<T, Classes extends { prototype: unknown }[]>(
  xs: readonly T[],
  classes: Classes
): AbstractInstanceType<Classes[number]>[] {
  return xs.filter((x) =>
    classes.some((k) => x instanceof (k as never))
  ) as never;
}

export function isAllSame(values: readonly unknown[]): boolean {
  for (let i = 1; i < values.length; ++i) {
    if (!isEqual(values[0], values[i])) {
      return false;
    }
  }
  return true;
}

export function divideIntToArray(value: number, count: number): number[] {
  const quotient = Math.floor(value / count);
  const rem = value - quotient * count;

  const results = new Array(count).fill(quotient) as number[];
  for (let i = 0; i < rem; ++i) {
    results[i] += 1;
  }

  return results;
}

export function undefinedIfEmpty<T>(value: T): T | undefined {
  return isEmpty(value) ? undefined : value;
}

export function omitEmpties<T extends object>(value: T): Partial<T> {
  return omitBy(value, (v) => isEmpty(v));
}
