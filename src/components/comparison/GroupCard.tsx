import { QuoteType } from "@/src/types/custom/Quote";
import { QuoteCard } from "./QuoteCard";
import Image from "next/image";
import { FaEdit, FaSave, FaStar } from "react-icons/fa";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { contributionSettingsAtom } from "./contributionSettingsAtom";
import { IoIosSettings } from "react-icons/io";
import { PlanGroupContextProvider } from "@/src/context/PlanGroupContext";
import { PlanSpecificClassInfoType } from "@/src/types/custom/Class";
import { ClientContext } from "@/src/context/ClientContext";
import { QuoteTypeWithCheckbox } from "@/src/app/select/page";
import { supabase } from "@/src/supabase";
import router from "next/router";

type GroupCardProps = {
  plan: any;
  fieldObject: any;
  classes: any;
  standardContribution: any;
  clientId: any;
  planSpecificClassInfo: any;
  fetchClientAndQuotes: any;
};

export function GroupCard({
  plan,
  fieldObject,
  classes,
  standardContribution,
  planSpecificClassInfo,
  clientId,
  fetchClientAndQuotes,
}: GroupCardProps) {
  // const carrierLogos = {
  //   Aetna: AetnaLogo,
  //   Anthem: AnotherCarrierLogo,
  //   Cigna: Cigna,
  //   United: United,
  //   Chamber: Chamber,
  //   Other: NewProject,
  //   BCBS: BCBS,
  // };
  const [isContributionSettingsExpanded, setIsContributionSettingsExpanded] =
    useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { sharingId } = useContext(ClientContext);
  const [quotes, setQuotes] = useState<any[]>([]);
  console.log("fuck me", plan);

  useEffect(() => {
    fetchQuoteData(clientId)
  }, [])

  const firstQuote = quotes.find(quote => quote.id === plan.selectedQuotes[0]) as any;

  const fetchQuoteData = async (clientId: any) => {
    if (clientId) {
      const { data, error } = await supabase
        .from("quotes")
        .select()
        .eq("client_id", clientId);

      if (error) {
        alert("Error updating data");
        router.push("/404");
      } else {
        // Check if selected_quotes is not null
        setQuotes(data);
      }
    }
  };

  console.log("SHARING", sharingId);
  console.log("PLAN", plan);

  if (!quotes.length) {
    return <></>
  }

  return (
    <PlanGroupContextProvider
      value={{
        isEditing,
        quotes: plan.selectedQuotes,
        clientId,
        planId: plan.id,
        fetchClientAndQuotes,
      }}
    >
      <div className="flex-col w-fit bg-white mb-4 h-fit rounded-md">
        <div
          className={`relative flex flex-col justify-center pt-3 pr-4 items-center border border-b-0 rounded-b-none border-gray-300 rounded-t-md
      ${
        firstQuote.carrier?.includes("Anthem")
          ? "bg-yellow-100/50"
          : firstQuote.carrier?.includes("United")
            ? "bg-blue-100/50"
            : firstQuote.carrier?.includes("Cigna")
              ? "bg-red-100/50"
              : firstQuote.carrier?.includes("Aetna")
                ? "bg-violet-100/50"
                : "bg-green-100/50"
      } 
      `}
        >
          {!sharingId ? (
            isEditing ? (
              <FaSave
                onClick={() => {
                  setIsEditing(false);
                }}
                className="absolute top-0 left-0 ml-3 mt-3"
              />
            ) : (
              <FaEdit
                onClick={() => {
                  setIsEditing(true);
                }}
                className="absolute top-0 left-0 ml-3 mt-3"
              />
            )
          ) : (
            <></>
          )}
          {/* <div
            className="w-full flex justify-end"
            onClick={() =>
              setIsContributionSettingsExpanded(!isContributionSettingsExpanded)
            }
          > */}
          {/* <p className="m-2 text-sm">
              {isContributionSettingsExpanded
                ? "Collapse Contribution Setttings"
                : "Expand Contribution Settings"}
            </p>
            <IoIosSettings className="w-6 h-6" /> */}
          {/* </div> */}
          <div className="flex rounded-md w-full gap-3 h-fit mb-6 mt-2 justify-center items-center px-2">
            <div className="max-w-1/2 flex items-center justify-center truncate gap-1 text-wrap">
              {plan.isCurrentPlan ? <FaStar /> : null}
              <h1 className="font-semibold text-lg truncate">
                {plan.isCurrentPlan ? "Current Plan Option" : plan.name}
              </h1>
            </div>
            <div className="border-r border-1.5 h-10 border-gray-600"></div>{" "}
            {/* Vertical line break */}
            <div className="flex max-w-1/2 truncate">
              <div className="flex items-center justify-center">
                {firstQuote.carrier?.includes(
                  "UnitedHealthcare",
                ) ? (
                  <Image
                    src="/United.png"
                    alt={`Logo for ${firstQuote.carrier}`}
                    width={30}
                    height={30}
                    className="mr-2 rounded-md"
                  />
                ) : firstQuote.carrier?.includes("Anthem") ||
                    firstQuote.carrier?.includes(
                    "Blue Cross and Blue Shield",
                  ) ? (
                  <Image
                    src="/Anthem.jpeg"
                    alt={`Logo for ${firstQuote.carrier}`}
                    width={30}
                    height={30}
                    className="mr-2 rounded-md"
                  />
                ) : (
                  firstQuote.logo_url && (
                    <Image
                      src={firstQuote.logo_url}
                      alt={`Logo for ${firstQuote.carrier}`}
                      width={30}
                      height={30}
                      className="mr-2 rounded-md"
                    />
                  )
                )}
              </div>
              <div className="flex flex-col items-start justify-center ml-1">
                <h1 className="font-semibold text-xl">
                  {firstQuote.carrier?.includes("UnitedHealthcare")
                    ? "United"
                    : firstQuote.carrier?.includes("Anthem") ||
                          firstQuote.carrier?.includes(
                          "Blue Cross and Blue Shield",
                        )
                      ? "Anthem"
                      : firstQuote.carrier}
                </h1>
                <p className="text-sm max-w-32 truncate">
                  {firstQuote.carrier?.includes("UnitedHealthcare")
                    ? "uhc.com"
                    : firstQuote.carrier?.includes("Anthem") ||
                          firstQuote.carrier?.includes(
                          "Blue Cross and Blue Shield",
                        )
                      ? "anthem.com"
                      : firstQuote.website}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-80 flex w-full h-fit text-center border border-l-0 border-t-0 border-b-0 border-gray-300">
          { plan.selectedQuotes.map((identifier: number) => {
            const selectedOne = quotes.find(quote => quote.id === identifier) as any;
            console.log("yo", quotes)
            console.log("what", selectedOne);
            console.log("the fuck", identifier)
              return <QuoteCard
                isContributionSettingsExpanded={isContributionSettingsExpanded}
                quote={selectedOne}
                fieldObject={fieldObject}
                key={identifier}
                planSpecificClassInfo={planSpecificClassInfo}
                classes={classes}
                standardContribution={standardContribution}
              />
            // <QuoteCard
            //   key={quote.id}
            //   quote={quote}
            //   fieldObject={fieldObject}
            //   classes={classes}
            //   standardContribution={standardContribution}
            // />
          } )}
        </div>
      </div>
    </PlanGroupContextProvider>
  );
}
