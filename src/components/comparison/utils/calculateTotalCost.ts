export function calculateTotalCost(
  standardContribution: any,
  customClasses: any,
  rates: any,
) {
  let totalSum = 0;
  if (customClasses.length) {
    for (const customClass of customClasses) {
      for (const value of ["employee", "family", "spouse", "child"]) {
        totalSum += parseFloat(
          (
            parseFloat(customClass.data[value].percent) *
            parseFloat(customClass.data[value].employees) *
            parseFloat(rates[value].slice(1, -1))
          ).toFixed(2),
        );
      }
    }
  } else {
    for (const value of ["employee", "family", "spouse", "child"]) {
      totalSum += parseFloat(
        (
          parseFloat(standardContribution.data[value].percent) *
          parseFloat(standardContribution.data[value].employees) *
          parseFloat(rates[value].slice(1, -1))
        ).toFixed(2),
      );
    }
    // Format totalSum when returning
  }
  return totalSum.toFixed(2);
}
