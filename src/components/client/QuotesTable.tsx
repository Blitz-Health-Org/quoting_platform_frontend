import {
  CoverageTypeOption,
  QuoteTypeWithCheckbox,
} from "@/src/app/select/page";
import Image from "next/image";
import { useContext, useState } from "react";
import { QuoteSchemaContext } from "@/src/context/QuoteSchemaContext";
import { QuoteType } from "@/src/types/custom/Quote";
import style from "styled-jsx/style";

interface PlanAttributesObjectType {
  [key: string]: string[] | PlanAttributesObjectType;
}

type QuotesTableProps = {
  quotes: QuoteTypeWithCheckbox[];
  planAttributes: string[];
  coverageType: CoverageTypeOption;
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
  coverageType,
  planAttributes,
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

  const { quoteSchema } = useContext(QuoteSchemaContext);

  const coverageTypeSpecificSchema = quoteSchema[coverageType];

  console.log("coverageTypeSpecificSchema", coverageTypeSpecificSchema);

  const renderAttributeColumn = (
    quote: QuoteTypeWithCheckbox,
    planAttribute: string,
    index: number,
    schema: any,
  ) => {
    console.log("SCHEMA", schema, planAttribute);
    console.log("QUOTEDATA", quote.data);
    if (typeof (quote.data as any)?.[planAttribute] === "string") {
      return (
        <div
          key={index}
          className="flex justify-center gap-2 min-w-32"
          style={{ width: `${entryWidth}px` }}
        >
          {(quote.data as any)?.[planAttribute] ?? "N/A"}
        </div>
      );
    } else if (
      typeof (quote.data as any)?.[planAttribute] === "object" &&
      (quote.data as any)?.[planAttribute]
    ) {
      return (
        Object.entries((quote.data as any)?.[planAttribute]).map(
          ([key, value]: any, index: number) => {
            return (
              <div key={index} className="flex justify-center gap-2 min-w-32">
                {schema?.properties?.[key]?.label}: {JSON.stringify(value)}
              </div>
            );
          },
        ) ?? "N/A"
      );
    } else {
      return "N/A";
    }
  };

  return (
    <>
      <div
        className={`w-full overflow-x-auto ${quotes.length <= 5 ? "h-full" : "h-fit"} pb-12`}
      >
        <div className="flex py-2 w-fit border-b">
          <div className="grid-cols-9 flex justify-left text-center w-fit gap-1 h-10 font-bold items-start text-wrap text-sm">
            {planAttributes.map((attribute, index) => {
              if (attribute === "carrier") {
                return (
                  <div
                    key={index}
                    className="flex justify-center gap-2 min-w-32"
                    style={{ width: `${entryWidth}px` }}
                  >
                    <p className="max-h-12 text-wrap overflow-hidden">
                      Carrier
                    </p>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className="flex justify-center gap-2 min-w-32"
                    style={{ width: `${entryWidth}px` }}
                  >
                    <p className="max-h-12 text-wrap overflow-hidden">
                      {
                        coverageTypeSpecificSchema?.properties?.[attribute]
                          ?.label
                      }
                    </p>
                  </div>
                );
              }
            })}
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
                <div className="grid-cols-9 relative w-full flex justify-left text-center gap-1 h-8 items-center text-sm">
                  <div className="flex absolute left-2 items-center justify-left ml-6">
                    <input
                      type="checkbox"
                      checked={quote.isSelected}
                      onChange={() => handleCheckboxChange(quote.id)}
                      className="mr-4"
                    />
                  </div>
                  {/* Map through the plan attributes for each quote */}
                  {planAttributes.map((attribute, index) => (
                    <div
                      key={index}
                      className="min-w-32 max-h-10 overflow-y-auto"
                      style={{ width: `${entryWidth}px` }}
                    >
                      {attribute === "carrier" ? (
                        <>
                          {quote.logo_url && (
                            <Image
                              src={quote.logo_url}
                              alt={`Logo for ${(quote as any)[attribute]}`}
                              width={20}
                              height={20}
                              className="mr-2 rounded-md"
                            />
                          )}
                          <p>{(quote as any)[attribute] || "N/A"}</p>
                        </>
                      ) : (
                        <p>
                          {renderAttributeColumn(
                            quote,
                            attribute,
                            index,
                            coverageTypeSpecificSchema?.properties?.[attribute],
                          )}
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
