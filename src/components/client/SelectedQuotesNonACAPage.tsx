import { QuoteTypeWithCheckbox } from "@/src/app/select/page";
import Image from "next/image";

interface PlanAttributes {
  plan_id: string;
  carrier: string;
  plan_name: string;
  plan_type: string;
  office_copay: string;
  deductible: string;
  coinsurance: string;
  out_of_pocket_max: string;
  additional_copay: string;
  total_cost: string;
}

type SelectedQuotesNonACAPageProps = {
  currentPlanId: number;
  quotes: QuoteTypeWithCheckbox[];
  planAttributesMapping: {
    key: keyof PlanAttributes;
    label: string;
    alternateKey?: string;
  }[];
  entryWidth: number;
  handleCheckboxChange: (quoteId: number) => void;
  handleAddNewQuote: (event: any) => void;
  search: string | undefined;
};

export const SelectedQuotesNonACAPage = ({
  currentPlanId,
  quotes,
  planAttributesMapping,
  handleCheckboxChange,
  handleAddNewQuote,
  search,
  entryWidth,
}: SelectedQuotesNonACAPageProps) => {
  console.log("currnetPlanId", currentPlanId, quotes);
  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="flex py-2 w-fit border-b">
          <div className="grid-cols-9 flex justify-left text-center w-fit gap-1 h-10 font-bold items-start text-wrap text-sm">
            {planAttributesMapping.map((attribute) => (
              <div
                key={attribute.key}
                className="flex justify-center gap-2 min-w-32"
                style={{ width: `${entryWidth}px` }}
              >
                <p>{attribute.label}</p>
              </div>
            ))}
          </div>
        </div>
        {quotes.length === 0 ? (
          <div className="flex w-full mt-16 mb-2 h-fit items-center justify-center flex-col">
            <p className="mb-2">No Quotes</p>
            <button
              onClick={handleAddNewQuote}
              className="bg-gray-100 outline outline-1 outline-gray-300 rounded-md px-2 py-0.5"
            >
              Add Quotes
            </button>
          </div>
        ) : (
          quotes
            .filter(
              (quote: any) =>
                !search || // Only apply the filter if search is empty
                ((quote.data as any)?.["plan_id"] + quote.carrier)
                  .toLowerCase()
                  .includes(search.toLowerCase()),
            )
            .map((quote) => (
              <div
                key={quote.id}
                className={`flex items-center w-fit mb-1 mt-1 py-2 border-b ${quote.id === currentPlanId ? "bg-cyan-500" : ""}`}
              >
                <div className="grid-cols-9 w-full flex justify-left text-center gap-1 h-8 items-center text-sm">
                  {/* Map through the plan attributes for each quote */}
                  {planAttributesMapping.map((attribute: any) => (
                    <div
                      key={attribute.key}
                      className="min-w-32 max-h-10 overflow-y-auto"
                      style={{ width: `${entryWidth}px` }}
                    >
                      {attribute.key === "carrier" ? (
                        <div className="flex items-center justify-left ml-6">
                          <input
                            type="checkbox"
                            checked={quote.isSelected}
                            onChange={() => handleCheckboxChange(quote.id)}
                            className="mr-4"
                          />
                          {quote.logo_url && (
                            <Image
                              src={quote.logo_url}
                              alt={`Logo for ${(quote as any)[attribute.key]}`}
                              width={20}
                              height={20}
                              className="mr-2 rounded-md"
                            />
                          )}
                          <p>{(quote as any)[attribute.key] || "N/A"}</p>
                        </div>
                      ) : (
                        <p>{(quote.data as any)?.[attribute.key] ?? "N/A"}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </>
  );
};
