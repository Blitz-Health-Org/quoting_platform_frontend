import { QuoteType } from "@/src/types/custom/Quote";
import { QuoteCard } from "./QuoteCard";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { contributionSettingsAtom } from "./contributionSettingsAtom";

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
    <div className="flex-col w-fit bg-white">
      <div className="flex flex-col justify-center items-center border border-b-0 rounded-b-none border-gray-300 rounded-t-md">
        <div className="flex bg-white  rounded-md w-full gap-3 h-28 justify-center items-center px-2">
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
              {plan.selectedQuotes[0].logo_url && (
                <Image
                  src={plan.selectedQuotes[0].logo_url}
                  alt={`Logo for ${plan.selectedQuotes[0].carrier}`}
                  width={30}
                  height={30}
                  className="mr-2 rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col items-start justify-center ml-1">
              <h1 className="font-bold text-xl">
                {plan.selectedQuotes[0].carrier}
              </h1>
              <p className="text-sm max-w-32 truncate">
                {plan.selectedQuotes[0].website}
              </p>
            </div>
          </div>
        </div>
        <div
          className="border border-slate-300 rounded-lg hover:bg-slate-300 bg-slate-100  mb-2"
          onClick={() =>
            setIsContributionSettingsExpanded(!isContributionSettingsExpanded)
          }
        >
          <p className="m-2 text-sm">
            {isContributionSettingsExpanded
              ? "Collapse Contribution Setttings"
              : "Expand Contribution Settings"}
          </p>
        </div>
      </div>
      <div className="flex w-fit text-center border border-l-0 border-t-0 border-b-0 border-gray-300">
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
