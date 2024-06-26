// import { useRef, useState } from "react";
// import Image from "next/image";
// import Apple from "@/public/Screenshot.png";
// import { QuoteType } from "@/src/types/custom/Quote";
// import { NonSystemField } from "@/src/types/metadata";
// import { supabase } from "@/src/supabase";
// import { useListenClickOutside } from "../ui/dropdown/utils/useListenClickOutside";
// import { valueOrDefault } from "chart.js/dist/helpers/helpers.core";
// import { calculateTotalCost } from "./utils/calculateTotalCost";

import { QuoteColumnDisplay } from "./QuoteColumnDisplay";
import Image from "next/image";
import { calculateTotalCost } from "./utils/calculateTotalCost";
import { MdOutlineArrowDropDown, MdOutlineArrowRight } from "react-icons/md";
import { max } from "lodash";
import { QuoteCardContinuousSlider } from "./QuoteCardContinuousSlider";
import { useState } from "react";
import { ContinuousSlider } from "./ContributionSlider";
import { PlanSpecificClassInfoType } from "@/src/types/custom/Class";

// type QuoteCardProps = {
//   quote: QuoteType;
//   fieldObject: any;
//   classes: any;
//   standardContribution: any;
// };

export type QuoteCardProps = {
  fieldObject: any;
  quote: any;
  classes: any;
  standardContribution: any;
  isContributionSettingsExpanded: any;
  isEditing?: boolean;
  planSpecificClassInfo: PlanSpecificClassInfoType;
};

export const QuoteCard = ({
  fieldObject,
  quote,
  classes,
  standardContribution,
  isContributionSettingsExpanded,
  isEditing,
  planSpecificClassInfo,
}: QuoteCardProps) => {
  const [quoteSpecificContribution, setQuoteSpecificContribution] =
    useState<any>(standardContribution);
  // const calculatedTotalCost = null;

  const planSpecificClasses = planSpecificClassInfo.filter(
    (classItem) => classItem.plan_id === quote.id,
  );
  // const calculatedTotalCost = calculateTotalCost(
  //   {},
  //   quote,
  //   planSpecificClasses);

  console.log("QUOTE QUOTE QUOTE", quote);
  const calculatedTotalCost = quote.data.total_employer_cost;

  return (
    <QuoteColumnDisplay
      field={fieldObject}
      quoteId={quote.id}
      quoteData={quote.data}
      isQuoteCard
      initialExpanded
      calculatedTotalCost={calculatedTotalCost}
      isEditing={isEditing}
      headerComponent={
        isContributionSettingsExpanded && (
          <div className="flex w-full justify-center items-center p-5">
            <div className="bg-slate-100/80 rounded-sm shadow w-fit p-2">
              <div className="grid grid-cols-[1fr_1fr_1.5fr_1fr] mb-4 text-center items-center gap-2">
                <div className="font-bold text-sm w-full">Tier</div>
                <div className="font-bold text-sm w-full">Lives</div>
                <div className="font-bold text-sm w-full overflow-x-auto">
                  Contribution
                </div>
                <div className="font-bold text-sm w-full">Rates</div>

                {["Employee", "Family", "Child", "Spouse"].map((tier) => (
                  <>
                    <div className="flex justify-center">
                      <div className="text-xs">{tier}</div>
                    </div>
                    <div className="flex justify-center">
                      <input
                        className="w-12 mx-2 border border-slate-300 rounded-lg px-1 text-xs h-5 justify-center"
                        value={
                          standardContribution.data[tier.toLowerCase()]
                            .employees
                        }
                        onChange={(e) =>
                          setQuoteSpecificContribution((prev: any) => ({
                            ...prev,
                            data: {
                              ...prev.data,
                              [tier.toLowerCase()]: {
                                ...prev.data.employee,
                                employees:
                                  e.target.value === ""
                                    ? 0
                                    : parseInt(e.target.value),
                              },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="flex w-40 justify-center">
                      <QuoteCardContinuousSlider
                        setContribution={setQuoteSpecificContribution}
                        className="mx-2 rounded-lg px-1 text-xs h-5"
                        hideLabels
                        tier={tier.toLowerCase()}
                      />
                    </div>
                    <div className="flex justify-center">
                      {" "}
                      <input
                        className={`w-20 mx-2 border border-slate-300 rounded-lg px-1 text-xs h-5 justify-center ${quote.data?.[`${tier.toLowerCase()}_rate`] ? "bg-gray-200 text-gray-500 outline-none" : "border-slate-300"}`}
                        value={
                          quote.data?.[`${tier.toLowerCase()}_rate`] !==
                            undefined &&
                          quote.data?.[`${tier.toLowerCase()}_rate`] !== null
                            ? quote.data?.[`${tier.toLowerCase()}_rate`]
                            : "N/A"
                        }
                        readOnly={quote.data?.[`${tier.toLowerCase()}_rate`]}
                        onChange={(e) =>
                          setQuoteSpecificContribution((prev: any) => ({
                            ...prev,
                            data: {
                              ...prev.data,
                              [tier.toLowerCase()]: {
                                ...prev.data.percent,
                                employees: parseInt(e.target.value),
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        )
      }
    />
  );
};
