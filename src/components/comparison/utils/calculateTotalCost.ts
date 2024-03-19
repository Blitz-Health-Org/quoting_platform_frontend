import { CensusDataType } from "@/src/app/cost/page";
import { PlanSpecificClassInfoType } from "@/src/app/cost/utils/getClasses";
import { QuoteType } from "@/src/types/custom/Quote";
import { cleanInput } from "./cleanInput";

type RateType = {
  employee: number;
  spouse: number;
  child: number;
  family: number;
};

export type TierType = "employee" | "spouse" | "family" | "child";

export function calculateTotalCost(
  metadata: Record<string, any>,
  // censusData: CensusDataType | null,
  // rates: RateType,
  // classes: PlanSpecificClassInfoType[],
  plan: QuoteType,
  planSpecificClasses: PlanSpecificClassInfoType[],
): string {
  const tiers: TierType[] = ["employee", "spouse", "family", "child"];


  const rates = {
    employee: cleanInput(plan.data.employee_rate as string)[0],
    spouse: cleanInput(plan.data.spouse_rate as string)[0],
    child: cleanInput(plan.data.child_rate as string)[0],
    family: cleanInput(plan.data.family_rate as string)[0],
    
    
  };

  let totalCost = 0.0;
  for (const employerClass of planSpecificClasses) {
    for (const tier of tiers) {
      if (
        employerClass[tier].contribution_percentage &&
        rates?.[tier] &&
        employerClass?.[tier].num_lives
      ) {
        totalCost +=
          employerClass[tier].contribution_percentage *
          rates[tier] *
          employerClass?.[tier].num_lives *
          0.01;
      }
    }
  }

  return totalCost.toFixed(2);
}

// export function calculateTotalCost(
//   quoteData: any,
//   contribution: any,
//   rates: any,
//   client: any,
//   customClasses?: any,
// ) {
//   // if (quoteData?.metadata?.total_employer_cost_is_precalculated) {
//   //   let allFourTiersNACount = 0;
//   //   let totalSum = 0;
//   //   for (const value of ["employee", "family", "spouse", "child"]) {
//   //     if (!rates[value]) {
//   //       allFourTiersNACount += 1;
//   //       if (allFourTiersNACount === 4) {
//   //         return "N/A";
//   //       }
//   //     }
//   //     if (
//   //       contribution?.data?.[value]?.percent &&
//   //       contribution?.data?.[value]?.employees &&
//   //       rates?.[value]
//   //     ) {
//   //       totalSum += parseFloat(
//   //         (
//   //           parseFloat(contribution.data[value].percent) *
//   //           parseFloat(contribution.data[value].employees) *
//   //           parseFloat(rates?.[value]?.slice(1, -1).replace(",", "") || 0) *
//   //           0.01
//   //         ).toFixed(2),
//   //       );
//   //     }
//   //   }
//   //   // Format totalSum when returning

//   //   const finalSum = `$${totalSum.toFixed(2)}`;
//   //   return finalSum;
//   // }

//   const calculationMethod =
//     quoteData?.metadata?.total_employer_cost_calculation_method;

//   if (calculationMethod === "aca_age_banded") {
//     //implement (need more aca context)
//     return "N/A";
//   } else if (calculationMethod === "role_based") {
//     //TODO: Make this complete based on more complete census informatoin
//     return (
//       client.num_lives *
//       quoteData.cost.rates.employee *
//       contribution["employee"].percent
//     );
//   }

//   let totalSum = 0;
//   if (customClasses?.length) {
//     for (const customClass of customClasses) {
//       for (const value of ["employee", "family", "spouse", "child"]) {
//         if (!rates[value]) {
//           return "N/A";
//         }
//         totalSum += parseFloat(
//           (
//             parseFloat(customClass.data[value].percent) *
//             parseFloat(customClass.data[value].employees) *
//             parseFloat(rates[value].slice(1, -1).replace(",", "")) *
//             0.01
//           ).toFixed(2),
//         );
//       }
//     }
//   }
// }
