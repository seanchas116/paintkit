import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";

export function toFormattedJSON(value: any): string {
  return prettier.format(JSON.stringify(value), {
    parser: "json",
    plugins: [parserBabel],
  });
}
