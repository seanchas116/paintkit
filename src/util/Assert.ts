export function assertNonNull<T>(value: T | null | undefined): T {
  if (value == null) {
    throw new Error("value is null");
  }
  return value;
}
