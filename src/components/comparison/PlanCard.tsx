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

  return (
    <div className="flex overflow-scroll bg-white h-fit mb-4 min-w-80 mt-4 rounded-lg outline outline-1 outline-gray-300 pt-6 pb-1 mr-1 text-center">
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
