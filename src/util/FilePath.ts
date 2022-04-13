import { posix as path } from "path";

export function getImportPath(from: string, to: string): string {
  if (!to.startsWith("/")) {
    return to;
  }

  const relative = path.relative(path.dirname(from), to);
  if (!relative.startsWith(".")) {
    return `./${relative}`;
  }
  return relative;
}

export function resolveImportPath(from: string, to: string): string {
  if (!to.startsWith(".")) {
    return to;
  }

  return path.join(path.dirname(from), to);
}
