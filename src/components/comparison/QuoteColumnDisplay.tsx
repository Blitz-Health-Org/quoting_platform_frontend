import { RecursiveQuoteColumnDisplay } from "./RecursiveQuoteColumnDisplay";

type QuoteColumnDisplayProps = {
  field: any;
  initialExpanded: boolean;
  className?: string;
  quoteData?: any;
  totalCost?: any;
  headerComponent?: React.ReactNode;
  isQuoteCard?: boolean;
};

export const QuoteColumnDisplay = ({
  field,
  initialExpanded,
  className,
  quoteData,
  headerComponent,
  totalCost,
  isQuoteCard = false,
}: QuoteColumnDisplayProps) => {
  console.log("quotedata in non recursive", quoteData);
  return (
    <>
      <div
        className={`min-w-64 bg-white flex-grow flex flex-col h-fit border border-r-0 border-gray-300 text-center overflow-y-auto ${className || ""}`}
      >
        {headerComponent ? (
          <>{headerComponent}</>
        ) : (
          // <div className="mb-28"></div>
          <div></div>
        )}
        <RecursiveQuoteColumnDisplay
          field={field}
          initialExpanded={initialExpanded}
          quoteData={quoteData}
          isQuoteCard={isQuoteCard}
        />
      </div>
    </>
  );
};
