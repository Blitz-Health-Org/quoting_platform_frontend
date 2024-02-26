export function calculateTotalCost(
  standardContributions: any,
  customClasses: any,
  rates: any,
) {
  if (customClasses.length) {
    return; //IMPLEMENT WITH RATES
  } else {
    let totalSum = 0;
    for (const value of ["employee", "family", "spouse", "child"]) {
      totalSum +=
        standardContributions[value].percent *
        standardContributions[value].employees *
        rates[value];
    }
    return totalSum;
  }
}
