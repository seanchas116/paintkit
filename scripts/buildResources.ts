import path from "path";
import fs from "fs";
import util from "util";
import _glob from "glob";
import dedent from "dedent";
import { ElementNode, parse } from "svg-parser";

const glob = util.promisify(_glob);

async function generateIcons(cwd: string): Promise<void> {
  const files = await glob("**/*.svg", { cwd });
  for (const file of files) {
    const filePath = path.resolve(cwd, file);
    const basePath = filePath.slice(0, -4);
    const svgText = fs.readFileSync(filePath, { encoding: "utf-8" });
    const rootNode = parse(svgText);
    const svgNode = rootNode.children[0] as ElementNode;

    const width = Number(svgNode.properties!.width);
    const height = Number(svgNode.properties!.height);
    const body =
      '<g fill="none">' +
      svgText
        .replace(/<svg[^>]*>/, "")
        .replace("</svg>", "")
        .replaceAll(/#(?:[0-9a-fA-F]{3}){1,2}/g, "currentColor") +
      "</g>";

    fs.writeFileSync(
      `${basePath}.ts`,
      dedent`
        import { IconifyIcon } from '@iconify/types';
        const data: IconifyIcon = {
          body: \`${body}\`,
          width: ${width},
          height: ${height},
        };
        export default data;
      `
    );
  }
}

async function generateCSSStrings(cwd: string): Promise<void> {
  const files = {
    simpleBar: "simplebar/dist/simplebar.min.css",
    tippy: "tippy.js/dist/tippy.css",
    minireset: "minireset.css/minireset.min.css",
  };

  fs.writeFileSync(
    `${path.resolve(cwd, "src/components/LibraryCSS")}.ts`,
    Object.entries(files)
      .map(([name, importPath]) => {
        const filePath = require.resolve(importPath);
        const content = fs.readFileSync(filePath, { encoding: "utf-8" });
        return dedent`
          // ${importPath}
          export const ${name}CSS = ${JSON.stringify(content.trim())};
        `;
      })
      .join("\n")
  );
}

const packageDir = path.dirname(__dirname);
const iconsDir = path.resolve(packageDir, "src/icon");

async function run() {
  await generateIcons(iconsDir);
  await generateCSSStrings(packageDir);
}

run().finally(() => {});
