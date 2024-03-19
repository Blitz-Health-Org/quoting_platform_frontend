/**
 * Parses a string to number and returns a list: [input, parseSucceeded]
 */
export function cleanInput(input: string): [number, boolean] {
  const cleanedInput = input.trim().replace(/[$,]/g, "");

  const parsedInput = parseFloat(cleanedInput);

  // Check if the parsed input is a number
  if (!isNaN(parsedInput)) {
    return [parsedInput, true];
  } else {
    console.error("Input cannot be converted to a float:", input);
    return [0, false];
  }
}
