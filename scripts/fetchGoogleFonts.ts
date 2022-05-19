import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import fetch from "cross-fetch";

dotenv.config();

async function fetchFontsJSON(): Promise<string> {
  const apiKey = process.env.GOOGLE_FONTS_API_KEY;
  if (!apiKey) {
    throw new Error(`No GOOGLE_FONTS_API_KEY. Set it in ".env".`);
  }

  const result = await (
    await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`)
  ).text();

  fs.writeFileSync(
    path.resolve(__dirname, `../src/util/GoogleFonts.json`),
    result
  );

  return result;
}

void fetchFontsJSON();
