import { RecursiveQuoteColumnDisplay } from "./RecursiveQuoteColumnDisplay";

type QuoteColumnDisplayProps = {
  quoteId?: number;
  field: any;
  initialExpanded: boolean;
  className?: string;
  quoteData?: any;
  totalCost?: any;
  headerComponent?: React.ReactNode;
  isQuoteCard?: boolean;
  calculatedTotalCost?: any;
  isEditing?: boolean;
};

export const QuoteColumnDisplay = ({
  quoteId,
  field,
  initialExpanded,
  className,
  quoteData,
  headerComponent,
  calculatedTotalCost,
  totalCost,
  isEditing,
  isQuoteCard = false,
}: QuoteColumnDisplayProps) => {

  return (
    <>
      <div
        className={`${isQuoteCard ? "min-w-50" : "min-w-36"} ${!headerComponent ? "border-t-0" : ""} bg-white flex-grow flex flex-col h-fit border border-r-0 border-gray-300 text-center overflow-y-auto ${className || ""}`}
      >
        {headerComponent ? (
          <>{headerComponent}</>
        ) : (
          // <div className="mb-28"></div>
          <div></div>
        )}
        <RecursiveQuoteColumnDisplay
          quoteId={quoteId}
          field={field}
          calculatedTotalCost={calculatedTotalCost}
          initialExpanded={initialExpanded}
          quoteData={quoteData}
          isQuoteCard={isQuoteCard}
          isEditing={isEditing}
        />
      </div>
    </>
  );
};
