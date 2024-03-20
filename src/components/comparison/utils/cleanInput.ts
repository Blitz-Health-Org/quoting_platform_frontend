/**
 * Recursively cleans string values within an object or the string itself, parsing them to numbers,
 * and returns the manipulated object/string and whether the cleaning succeeded.
 */
export function cleanInput(input: any): [any, boolean] {
  let parseSucceeded = true;

  // Helper function to clean strings
  function cleanString(value: string): [number, boolean] {
    const cleanedValue = value.trim().replace(/[$,]/g, "");
    if (/^[0-9.]+$/.test(cleanedValue)) {
      const numberValue = Number(cleanedValue);
      return [numberValue, true];
    } else {
      console.error(
        "Input contains invalid characters or cannot be converted to a number:",
        value,
      );
      return [0, false];
    }
  }

  // Function to recursively clean input
  function cleanRecursive(input: any): any {
    if (typeof input === "string") {
      const [cleaned, success] = cleanString(input);
      if (!success) parseSucceeded = false;
      return cleaned;
    } else if (typeof input === "object" && input !== null) {
      const entries = Object.entries(input).map(([key, value]) => {
        if (typeof value === "string") {
          const [cleanedValue, success] = cleanString(value);
          if (!success) parseSucceeded = false;
          return [key, cleanedValue];
        } else if (typeof value === "object") {
          return [key, cleanRecursive(value)];
        } else {
          return [key, value];
        }
      });
      return Object.fromEntries(entries);
    } else {
      return input;
    }
  }

  const cleanedData = cleanRecursive(input);
  return [cleanedData, parseSucceeded];
}
