export type ValidationResult =
  | { value: true }
  | { value: false; error: string };
