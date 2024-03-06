import { QuoteType } from "@/src/types/custom/Quote";
import { QuoteCard } from "./QuoteCard";

type PlanCardProps = {
  plan: any;
  fieldObject: any;
  classes: any;
  standardContribution: any;
};

export function PlanCard({
  plan,
  fieldObject,
  classes,
  standardContribution,
}: PlanCardProps) {
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
    <div className="flex flex-grow bg-white h-full rounded-lg outline outline-1 outline-gray-300  text-center gap-2">
      {plan.selectedQuotes.map((quote: QuoteType) => (
        <QuoteCard
          plan={plan}
          quote={quote}
          fieldObject={fieldObject}
          key={quote.id}
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
      ))}
    </div>
  );
}
