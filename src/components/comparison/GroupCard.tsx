import { QuoteType } from "@/src/types/custom/Quote";
import { QuoteCard } from "./QuoteCard";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { contributionSettingsAtom } from "./contributionSettingsAtom";
import { IoIosSettings } from "react-icons/io";

type GroupCardProps = {
  plan: any;
  fieldObject: any;
  classes: any;
  standardContribution: any;
  setStandardContribution: any;
};

export function GroupCard({
  plan,
  fieldObject,
  classes,
  standardContribution,
  setStandardContribution,
}: GroupCardProps) {
  const [isContributionSettingsExpanded, setIsContributionSettingsExpanded] =
    useRecoilState(contributionSettingsAtom);

  // const carrierLogos = {
  //   Aetna: AetnaLogo,
  //   Anthem: AnotherCarrierLogo,
  //   Cigna: Cigna,
  //   United: United,
  //   Chamber: Chamber,
  //   Other: NewProject,
  //   BCBS: BCBS,
  // };

  return (
    <div className="flex-col w-fit bg-white h-fit">
      <div className="flex flex-col justify-center pt-3 pr-4 items-center border border-b-0 rounded-b-none border-gray-300 rounded-t-md">
        {/* <div
          className="w-full flex justify-end"
          onClick={() =>
            setIsContributionSettingsExpanded(!isContributionSettingsExpanded)
          }
        >
          <p className="m-2 text-sm">
            {isContributionSettingsExpanded
              ? "Collapse Contribution Setttings"
              : "Expand Contribution Settings"}
          </p>
          <IoIosSettings className="w-6 h-6" />
        </div> */}
        <div className="flex bg-white rounded-md w-full gap-3 h-fit mb-6 mt-2 justify-center items-center px-2">
          <div className="max-w-1/2 flex items-center justify-center truncate gap-1">
            {plan.isCurrentPlan ? <FaStar /> : null}
            <h1 className="font-bold text-lg text-wrap max-w-32">
              {plan.isCurrentPlan ? "Current Plan" : plan.name}
            </h1>
          </div>
          <div className="border-r border-1.5 h-10 border-gray-600"></div>{" "}
          {/* Vertical line break */}
          <div className="flex max-w-1/2 truncate">
            <div className="flex items-center justify-center">

              {plan.selectedQuotes[0].carrier.includes("UnitedHealthcare") ? (
                <Image
                  src="/United.png"
                  alt={`Logo for ${plan.selectedQuotes[0].carrier}`}
                  width={30}
                  height={30}
                  className="mr-2 rounded-md"
                />
              ) : plan.selectedQuotes[0].carrier.includes("Anthem") ||
                plan.selectedQuotes[0].carrier.includes(
                  "Blue Cross and Blue Shield",
                ) ? (
                <Image
                  src="/Anthem.jpeg"
                  alt={`Logo for ${plan.selectedQuotes[0].carrier}`}
                  width={30}
                  height={30}
                  className="mr-2 rounded-md"
                />
              ) : (
                plan.selectedQuotes[0].logo_url && (
                  <Image
                    src={plan.selectedQuotes[0].logo_url}
                    alt={`Logo for ${plan.selectedQuotes[0].carrier}`}
                    width={30}
                    height={30}
                    className="mr-2 rounded-md"
                  />
                )
              )}
            </div>
            <div className="flex flex-col items-start justify-center ml-1">
              <h1 className="font-bold text-xl">
                {plan.selectedQuotes[0].carrier.includes("UnitedHealthcare")
                  ? "United"
                  : plan.selectedQuotes[0].carrier.includes("Anthem") ||
                      plan.selectedQuotes[0].carrier.includes(
                        "Blue Cross and Blue Shield",
                      )
                    ? "Anthem BCBS"
                    : plan.selectedQuotes[0].carrier}
              </h1>
              <p className="text-sm max-w-32 truncate">
                {plan.selectedQuotes[0].carrier.includes("UnitedHealthcare")
                  ? "www.uhc.com"
                  : plan.selectedQuotes[0].carrier.includes("Anthem") ||
                      plan.selectedQuotes[0].carrier.includes(
                        "Blue Cross and Blue Shield",
                      )
                    ? "www.anthem.com"
                    : plan.selectedQuotes[0].website}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="min-w-80 flex w-fit h-fit text-center border border-l-0 border-t-0 border-b-0 border-gray-300">
        {plan.selectedQuotes.map((quote: QuoteType) => (
          <QuoteCard
            plan={plan}
            quote={quote}
            fieldObject={fieldObject}
            key={quote.id}
            classes={classes}
            standardContribution={standardContribution}
            isContributionSettingsExpanded={isContributionSettingsExpanded}
          />
          // <QuoteCard
          //   key={quote.id}
          //   quote={quote}
          //   fieldObject={fieldObject}
          //   classes={classes}
          //   standardContribution={standardContribution}
          // />
        ))}
      </div>
    </div>
  );
}
