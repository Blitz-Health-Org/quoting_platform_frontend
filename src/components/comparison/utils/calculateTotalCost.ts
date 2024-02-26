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
      totalSum += parseFloat(
        (
          parseFloat(standardContributions[value].percent) *
          parseFloat(standardContributions[value].employees) *
          parseFloat(rates[value].slice(1, -1))
        ).toFixed(2),
      );
    }
    // Format totalSum when returning
    return totalSum.toFixed(2);
  }
}
