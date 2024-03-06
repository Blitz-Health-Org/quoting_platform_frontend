import { RecursiveQuoteColumnDisplay } from "./RecursiveQuoteColumnDisplay";

type QuoteColumnDisplayProps = {
  field: any;
  initialExpanded: boolean;
  className?: string;
  quoteData?: any;
  headerComponent?: React.ReactNode;
  isQuoteCard?: boolean;
};

export const QuoteColumnDisplay = ({
  field,
  initialExpanded,
  className,
  quoteData,
  headerComponent,
  isQuoteCard = false,
}: QuoteColumnDisplayProps) => {
  return (
    <>
      <div
        className={` bg-white flex-grow flex flex-col h-full rounded-lg outline outline-1 outline-gray-300 text-center overflow-y-auto ${className || ""}`}
      >
        {headerComponent ? (
          <>{headerComponent}</>
        ) : (
          <div className="mb-28"></div>
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
