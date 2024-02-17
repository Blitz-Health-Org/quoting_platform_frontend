export function parseStrictFloat(value: string) {
  // Regular expression to match a floating-point number at the start of the string
  // and ensure it's the only content (ignoring whitespace at the end)
  const floatRegex = /^\s*-?\d+(\.\d+)?(e[+-]?\d+)?\s*$/i;

  if (!floatRegex.test(value)) {
    throw new Error("Input contains invalid characters or format");
  }

  return parseFloat(value);
}
