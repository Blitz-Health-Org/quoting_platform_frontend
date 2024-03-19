export function cleanInput(input: string): number {
  const cleanedInput = input.trim().replace(/[$,]/g, "");

  const parsedInput = parseFloat(cleanedInput);

  // Check if the parsed input is a number
  if (!isNaN(parsedInput)) {
    return parsedInput;
  } else {
    console.error("Input cannot be converted to a float:", input);
    return 0;
  }
}
