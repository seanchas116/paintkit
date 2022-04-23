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
    !!/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.exec(name) && !reservedWordRegExp.exec(name)
  );
}

export function toIdentifier(original: string): string {
  if (original.length === 0) {
    return "_";
  }

  const result = original.replace(/[^a-zA-Z_$0-9]/g, "_");
  if (/^[0-9]/.exec(result)) {
    return "_" + result;
  }
  if (reservedWordRegExp.exec(result)) {
    return result + "_";
  }
  return result;
}
