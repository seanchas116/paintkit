import path from "path";
import fs from "fs";
import util from "util";
import url from "url";
import _glob from "glob";
import dedent from "dedent";
import { ElementNode, parse } from "svg-parser";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

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

const packageDir = path.dirname(__dirname);
const iconsDir = path.resolve(packageDir, "src/icon");

async function run() {
  await generateIcons(iconsDir);
}

run().finally(() => {});
