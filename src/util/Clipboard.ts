export async function readCustomDataFromClipboard(): Promise<
  Record<string, unknown>
> {
  const items = await navigator.clipboard.read();
  for (const item of items) {
    if (item.types.includes("text/html")) {
      const htmlBlob = await item.getType("text/html");
      const htmlText = await htmlBlob.text();
      const doc = new DOMParser().parseFromString(htmlText, "text/html");
      const elem = doc.querySelector("[data-macaron-clipboard]");
      if (elem) {
        const base64 = elem.getAttribute("data-macaron-clipboard");
        if (base64) {
          const buffer = Buffer.from(base64, "base64");
          return JSON.parse(buffer.toString()) as Record<string, unknown>;
        }
      }
    }
  }
  return {};
}

export async function writeCustomDataToClipboard(
  values: Record<string, unknown>
): Promise<void> {
  const data = Buffer.from(JSON.stringify(values));

  const html = `<span data-macaron-clipboard="${data.toString(
    "base64"
  )}"></span>`;

  const blob = new Blob([html], { type: "text/html" });
  // @ts-ignore
  const clipboardItem = new ClipboardItem({ [blob.type]: blob });
  await navigator.clipboard.write([clipboardItem]);
}

export async function readClipboardImage(): Promise<Buffer | undefined> {
  const items = await navigator.clipboard.read();
  for (const item of items) {
    if (item.types.includes("image/png")) {
      const blob = await item.getType("image/png");
      return Buffer.from(await blob.arrayBuffer());
    }
  }
}
