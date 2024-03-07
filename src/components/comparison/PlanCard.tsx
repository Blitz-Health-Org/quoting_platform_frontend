import { QuoteType } from "@/src/types/custom/Quote";
import { QuoteCard } from "./QuoteCard";
import Image from "next/image";

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
    <div className="flex-col w-fit">
      <div className="flex bg-white border border-b-0 rounded-b-none border-gray-300 rounded-md w-full gap-3 h-28 justify-center items-center px-2">
        <div className="max-w-1/2 truncate">
          <h1 className="font-bold text-lg text-wrap max-w-32">{plan.name}</h1>
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
            <p className="text-sm max-w-16 truncate">
              {plan.selectedQuotes[0].website}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-fit rounded-lg text-center gap-2">
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
    </div>
  );
}
