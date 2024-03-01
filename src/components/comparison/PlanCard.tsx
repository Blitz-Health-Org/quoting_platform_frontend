import { useRef, useState } from "react";
import Image from "next/image";
import Apple from "@/public/Screenshot.png";
import { QuoteType } from "@/src/types/custom/Quote";
import { NonSystemField } from "@/src/types/metadata";
import { supabase } from "@/src/supabase";
import { useListenClickOutside } from "../ui/dropdown/utils/useListenClickOutside";
import { valueOrDefault } from "chart.js/dist/helpers/helpers.core";
import { calculateTotalCost } from "./utils/calculateTotalCost";

import AetnaLogo from "@/public/Screenshot.png";
import AnotherCarrierLogo from "@/public/Anthem.jpeg";
import Cigna from "@/public/Cigna.png";
import United from "@/public/United.png";
import Chamber from "@/public/Chamber.png";
import NewProject from "@/public/NewProject.jpg";
import BCBS from "@/public/BCBS.png";
import QuoteCard from "./QuoteCard";

type PlanCardProps = {
  plan: any
  nonObjectVisibleQuoteFields: NonSystemField[];
  objectVisibleQuoteFields: NonSystemField[];
  classes: any;
  standardContribution: any;
};

export default function PlanCard({
  plan,
  nonObjectVisibleQuoteFields,
  objectVisibleQuoteFields,
  classes,
  standardContribution
}: PlanCardProps) {


  const carrierLogos = {
    Aetna: AetnaLogo,
    Anthem: AnotherCarrierLogo,
    Cigna: Cigna,
    United: United,
    Chamber: Chamber,
    Other: NewProject,
    BCBS: BCBS,
  };

  const carrierWebsites = {
    Aetna: "aetna.com",
    Anthem: "anthem.com",
    Cigna: "cigna.com",
    United: "unitedhealthcare.com",
    Chamber: "chamberselect.com",
    BCBS: "bcbs.com",
    Other: "N/A",
  };

  return (
    <div className="flex overflow-scroll bg-white h-fit mb-4 min-w-80 mt-4 rounded-lg outline outline-1 outline-gray-300 pt-6 pb-1 mr-1 text-center">
      
      <div className="flex w-full h-fit justify-center items-center">
        <div className="w-fit h-fit mb-4 mr-1">
          <Image
            src={
              carrierLogos[plan.selectedQuotes[0].carrier as keyof typeof carrierLogos] ||
              carrierLogos["Other"]
            }
            alt={`Logo for ${plan.selectedQuotes[0].carrier}`}
            width={30}
            height={30}
            className="mr-2 rounded-md"
          />
        </div>
        <div className="flex flex-col w-fit justify-center items-start ml-1 mb-4">
          <h1 className="font-bold text-xl">{plan.selectedQuotes[0].carrier}</h1>
          <p className="text-sm">
            {carrierWebsites[plan.selectedQuotes[0].carrier as keyof typeof carrierLogos] ||
              carrierWebsites["Other"]}
          </p>
        </div>
      </div>
      
      {plan.selectedQuotes.map((quote: QuoteType) => (
        <div key={quote.id} className="quote-card">
            <QuoteCard
              key={quote.id}
              quote={quote}
              nonObjectVisibleQuoteFields={nonObjectVisibleQuoteFields}
              objectVisibleQuoteFields={objectVisibleQuoteFields}
              classes={classes}
              standardContribution={standardContribution}
            />
        </div>
      ))}
    </div>
  );
}
