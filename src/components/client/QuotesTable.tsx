import { QuoteTypeWithCheckbox } from "@/src/app/select/page";
import Image from "next/image";
import PlanAttributes from "@/src/app/select/page";
import { useState } from "react";

type QuotesTableProps = {
  quotes: QuoteTypeWithCheckbox[];
  planAttributesMapping: {
    key: any;
    label: string;
    alternateKey?: string;
  }[];
  entryWidth: number;
  handleCheckboxChange: (quoteId: number) => void;
  handleAddNewQuote: (event: any) => void;
  search: string | undefined;
  valueOOP: number[];
  valueDeductible: number[];
  valueEmployeeRate: any;
  parseValue2: (value: string | undefined) => number;
  findMaximumValue: any;
  findMinimumValue: any;
};

export const QuotesTable = ({
  quotes,
  planAttributesMapping,
  handleCheckboxChange,
  handleAddNewQuote,
  search,
  entryWidth,
  valueOOP,
  valueDeductible,
  valueEmployeeRate,
  parseValue2,
  findMaximumValue,
  findMinimumValue,
}: QuotesTableProps) => {
  if (valueDeductible[1] === 0) {
    valueDeductible[1] = findMaximumValue("deductible");
  }
  if (valueOOP[1] === 0) {
    valueOOP[1] = findMaximumValue("out_of_pocket_max");
  }
  if (valueEmployeeRate[1] === 0) {
    valueEmployeeRate[1] = findMaximumValue("employee_rate");
  }
  if (valueEmployeeRate[0] === 0) {
    valueEmployeeRate[0] = findMinimumValue("employee_rate");
  }

  return (
    <>
      <div
        className={`w-full overflow-x-auto ${quotes.length <= 5 ? "h-full" : "h-fit"} pb-12`}
      >
        <div className="flex py-2 w-fit border-b">
          <div className="grid-cols-9 flex justify-left text-center w-fit gap-1 h-10 font-bold items-start text-wrap text-sm">
            {planAttributesMapping.map((attribute) => (
              <div
                key={attribute.key as any}
                className="flex justify-center gap-2 min-w-32"
                style={{ width: `${entryWidth}px` }}
              >
                <p className="max-h-12 text-wrap overflow-hidden">
                  {attribute.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* {quotes.length} -{valueDeductible[0]} -{valueOOP[0]} -
        {valueDeductible[1]} -{valueOOP[1]} - */}
        {quotes.length === 0 ? (
          <div className="flex w-full mb-2 h-full items-center justify-center flex-col">
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
            .filter((quote: any) => {
              // console.log(parseValue2(quote.data["out_of_pocket_max"] ?? "0"), valueOOP[1])
              return (
                parseValue2(quote.data["deductible"] ?? "0") >=
                  (valueDeductible[0] || 0) &&
                parseValue2(quote.data["deductible"] ?? "0") <=
                  valueDeductible[1] &&
                parseValue2(quote.data["out_of_pocket_max"] ?? "0") >=
                  (valueOOP[0] || 0) &&
                parseValue2(quote.data["out_of_pocket_max"] ?? "0") <=
                  valueOOP[1] &&
                parseValue2(quote.data["employee_rate"] ?? "0") >=
                  (valueEmployeeRate[0] || 0) &&
                parseValue2(quote.data["employee_rate"] ?? "0") <=
                  valueEmployeeRate[1]
              );
            })
            .map((quote, index) => (
              <div
                key={quote.id}
                className={`flex items-center w-fit py-2 border-b ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
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
                        <p>
                          {(quote.data as any)?.[attribute.key] ??
                            (quote.data as any)?.[attribute?.alternateKey] ??
                            "N/A"}
                        </p>
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
