export function calculateTotalCost(
  quoteData: any,
  contribution: any,
  rates: any,
  client: any,
  customClasses?: any,
) {
  if (quoteData?.metadata?.total_employer_cost_is_precalculated) {
    let allFourTiersNACount = 0;
    let totalSum = 0;
    for (const value of ["employee", "family", "spouse", "child"]) {
      if (!rates[value]) {
        allFourTiersNACount += 1;
        if (allFourTiersNACount === 4) {
          return "N/A";
        }
      }
      if (
        contribution?.data?.[value]?.percent &&
        contribution?.data?.[value]?.employees &&
        rates?.[value]
      ) {
        totalSum += parseFloat(
          (
            parseFloat(contribution.data[value].percent) *
            parseFloat(contribution.data[value].employees) *
            parseFloat(rates?.[value]?.slice(1, -1).replace(",", "") || 0) *
            0.01
          ).toFixed(2),
        );
      }
    }
    // Format totalSum when returning

    const finalSum = `$${totalSum.toFixed(2)}`;
    return finalSum;
  }

  const calculationMethod =
    quoteData?.metadata?.total_employer_cost_calculation_method;

  if (calculationMethod === "aca_age_banded") {
    //implement (need more aca context)
    return "N/A";
  } else if (calculationMethod === "role_based") {
    //TODO: Make this complete based on more complete census informatoin
    return (
      client.num_lives *
      quoteData.cost.rates.employee *
      contribution["employee"].percent
    );
  }

  let totalSum = 0;
  if (customClasses?.length) {
    for (const customClass of customClasses) {
      for (const value of ["employee", "family", "spouse", "child"]) {
        if (!rates[value]) {
          return "N/A";
        }
        totalSum += parseFloat(
          (
            parseFloat(customClass.data[value].percent) *
            parseFloat(customClass.data[value].employees) *
            parseFloat(rates[value].slice(1, -1).replace(",", "")) *
            0.01
          ).toFixed(2),
        );
      }
    }
  }
}
