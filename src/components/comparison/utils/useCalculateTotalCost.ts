import { ClientContext } from "@/src/context/ClientContext";
import { useContext } from "react";

export function useCalculateTotalCost(
  quoteData: any,
  standardContribution: any,
  customClasses: any,
  rates: any,
  sliderContribution: any,
) {
  console.log(
    "calctotal cost",
    sliderContribution,
    quoteData,
    (
      (parseFloat(
        quoteData.total_employer_cost.replace("$", "").replace(",", ""),
      ) *
        sliderContribution) /
      50
    )
      .toFixed(2)
      .toString(),
  );
  const { client } = useContext(ClientContext);

  if (
    quoteData?.metadata?.total_employer_cost_is_precalculated &&
    !standardContribution?.data?.["employee"]?.employees &&
    !standardContribution?.data?.["family"]?.employees &&
    !standardContribution?.data?.["spouse"]?.employees &&
    !standardContribution?.data?.["child"]?.employees
  )
    return (
      (parseFloat(
        quoteData.total_employer_cost.replace("$", "").replace(",", ""),
      ) *
        sliderContribution) /
      50
    )
      .toFixed(2)
      .toString();

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
      standardContribution["employee"].percent
    );
  }

  let totalSum = 0;
  if (customClasses.length) {
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
  } else {
    let allFourTiersNACount = 0;
    for (const value of ["employee", "family", "spouse", "child"]) {
      if (!rates[value]) {
        allFourTiersNACount += 1;
        if (allFourTiersNACount === 4) {
          return "N/A";
        }
      }
      totalSum += parseFloat(
        (
          parseFloat(standardContribution.data[value].percent) *
          parseFloat(standardContribution.data[value].employees) *
          parseFloat(rates?.[value]?.slice(1, -1).replace(",", "") || 0) *
          0.01
        ).toFixed(2),
      );
    }
    // Format totalSum when returning
  }
  const finalSum = `$${totalSum.toFixed(2)}`;
  return finalSum;
}
