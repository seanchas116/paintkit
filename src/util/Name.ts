import shortUUID from "short-uuid";

/**
 * Generates a short-uuid based unique key.
 * It contains base58 characters and does not start with a number.
 */
export function generateUID(): string {
  let uid: string;
  do {
    uid = shortUUID.generate();
  } while (uid.match(/^[0-9]/));
  return uid;
}

export function incrementAlphanumeric(str: string): string {
  const numMatches = /[1-9][0-9]*$/.exec(str);
  if (numMatches) {
    const numPart = numMatches[0];
    const strPart = str.slice(0, str.length - numPart.length);

    return `${strPart}${Number.parseInt(numPart) + 1}`;
  }

  return str + "1";
}

export function getIncrementalUniqueName(
  existings: ReadonlySet<string>,
  name: string
): string {
  while (existings.has(name)) {
    name = incrementAlphanumeric(name);
  }
  return name;
}

const reservedWordRegExp =
  /^(do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|await|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/;

export function isValidJSIdentifier(name: string): boolean {
  return (
    /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name) && !reservedWordRegExp.test(name)
  );
}

export function isValidCSSIdentifier(name: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /^([a-z-_]|[^\u0000-\u00A0])([a-z0-9-_]|[^\u0000-\u00A0])*$/i.test(
    name
  );
}

export function toValidCSSIdentifier(original: string): string {
  if (original.length === 0) {
    return "_";
  }
  const result = [...original]
    .map((c) => {
      if (/[a-z0-9-_]/i.test(c)) {
        return c;
      }
      // eslint-disable-next-line no-control-regex
      if (/[^\u0000-\u00A0]/.test(c)) {
        return c;
      }
      return "_";
    })
    .join("");

  if (/^[0-9]/.exec(result)) {
    return "_" + result;
  }
  return result;
}
