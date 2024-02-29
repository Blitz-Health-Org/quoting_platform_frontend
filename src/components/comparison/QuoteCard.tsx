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

type QuoteCardProps = {
  quote: QuoteType;
  nonObjectVisibleQuoteFields: NonSystemField[];
  objectVisibleQuoteFields: NonSystemField[];
  classes: any;
  standardContribution: any;
};

export default function QuoteCard({
  quote,
  nonObjectVisibleQuoteFields,
  objectVisibleQuoteFields,
  classes,
  standardContribution,
}: QuoteCardProps) {
  const [quoteData, setQuoteData] = useState<any>(quote);

  const [textAreaSelected, setTextAreaSelected] = useState<boolean>(false);
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  const carrierLogos = {
    Aetna: AetnaLogo,
    Anthem: AnotherCarrierLogo,
    Cigna: Cigna,
    United: United,
    Chamber: Chamber,
    Other: NewProject,
    BCBS: BCBS
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

  const totalValue = calculateTotalCost(standardContribution, classes, {
    employee: quote?.data?.['employee_only_rate'] as any,
    child: quote?.data?.["employee_child_rate"] as any,
    family: quote?.data?.["employee_family_rate"] as any,
    spouse: quote?.data?.["employee_spouse_rate"] as any,
  });

  function valueOrDefault(val: any, def: string = "N/A") {
    return val ?? def;
  }

  function handleQuoteChange(path: string) {
    return (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;

      // Split the path into parts if it's nested, e.g., 'oop.name' becomes ['oop', 'name']
      const pathParts = path.split(".");

      // Function to recursively update the nested object
      const updateNestedObject = (obj: any, pathParts: any, value: any) => {
        // Clone the object at the current level
        let updated = { ...obj };

        // If we're at the last part of the path, update the value
        if (pathParts.length === 1) {
          updated[pathParts[0]] = value;
        } else {
          // If not, recursively update the next level
          const [currentPart, ...remainingParts] = pathParts;
          updated[currentPart] = updateNestedObject(
            obj[currentPart] || {},
            remainingParts,
            value,
          );
        }

        return updated;
      };

      // Update the quoteData using the recursive function
      const updatedQuote = updateNestedObject(quoteData, pathParts, newValue);

      // Update the state with the new quote
      setQuoteData(updatedQuote);
    };
  }

  useListenClickOutside({
    refs: [ref1 as any, ref2 as any, ref3 as any],
    callback: async (event) => {
      // SEND DATA
      try {
        const { data, error } = await supabase
          .from("quotes") // Replace with your actual table name
          .upsert(quoteData);

        if (error) {
          console.error("Error inserting data:", error);
        } else {
          console.log("Data inserted successfully:", data);
        }
      } catch (error) {
        console.error("Error connecting to Supabase:", error);
      }
      setTextAreaSelected(false);
    },
    enabled: textAreaSelected,
  });

  return (
    <div className="bg-white h-fit mb-4 min-w-80 mt-4 rounded-lg outline outline-1 outline-gray-300 pt-6 pb-1 mr-1 text-center overscroll-none">
      <div className="flex w-full h-fit justify-center items-center">
        <div className="w-fit h-fit mb-4 mr-1">
          <Image
            src={
              carrierLogos[quote.carrier as keyof typeof carrierLogos] ||
              carrierLogos["Other"]
            }
            alt={`Logo for ${quote.carrier}`}
            width={30}
            height={30}
            className="mr-2 rounded-md"
          />
        </div>
        <div className="flex flex-col w-fit justify-center items-start ml-1 mb-4">
          <h1 className="font-bold text-xl">{quote?.carrier}</h1>
          <p className="text-sm">
            {carrierWebsites[quote.carrier as keyof typeof carrierLogos] ||
              carrierWebsites["Other"]}
          </p>
        </div>
      </div>
      <hr className="w-full border-t-1 border-gray-300"></hr>

      <div className="flex flex-col items-center bg-violet-100/60">
        {nonObjectVisibleQuoteFields
          .filter(
            (field) => field.field !== "name" && field.field !== "website",
          )
          .map((field) => {
            return (
              <>
                <textarea
                  ref={ref1 as any}
                  onClick={() => setTextAreaSelected(true)}
                  onChange={handleQuoteChange(field.field)}
                  value={valueOrDefault((quoteData as any)[field.field])}
                  className="text-center resize-none text-sm content-center h-7 w-full bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto rounded-md p-1"
                />
                <hr className="w-full border-t-1 border-gray-300"></hr>
              </>
            );
          })}

        {quoteData?.plan_type ? (
          <>
            <div className="flex w-full">
              <textarea
                disabled
                value={valueOrDefault(quoteData.plan_type)}
                className="text-center font-semibold resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
              />
              <textarea
                disabled
                defaultValue={"Out-of-Network"}
                className="text-center font-semibold resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
              />
            </div>
            <hr className="w-full border-t-1 border-gray-500"></hr>

            {objectVisibleQuoteFields.map((objectField) => {
              return (
                <>
                  <div className="flex w-full">
                    <textarea
                      disabled
                      className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent border-r focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
                    />
                    <textarea
                      disabled
                      className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
                    />
                  </div>

                  {Object.entries(
                    JSON.parse(objectField.json_structure as string),
                  ).map(([subFieldKey, value]) => {
                    return (
                      <>
                        <hr className="w-full border-t-1 border-gray-300"></hr>
                        <div className="flex w-full bg-white">
                          <textarea
                            ref={ref3 as any}
                            onClick={() => setTextAreaSelected(true)}
                            onChange={handleQuoteChange(
                              `${objectField.field}.in.${subFieldKey}`,
                            )}
                            value={valueOrDefault(
                              (quoteData as any)[objectField.field]?.in?.[
                                subFieldKey
                              ],
                            )}
                            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
                          />
                          <textarea
                            ref={ref2 as any}
                            onClick={() => setTextAreaSelected(true)}
                            onChange={handleQuoteChange(
                              `${objectField.field}.oon.${subFieldKey}`,
                            )}
                            value={valueOrDefault(
                              (quoteData as any)[objectField.field]?.oon?.[
                                subFieldKey
                              ],
                            )}
                            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
                          />
                        </div>
                      </>
                    );
                  })}
                  <hr className="w-full border-t-1 border-gray-500"></hr>
                </>
              );
            })}
          </>
        ) : (
          <>
            <div className="flex w-full">
              <textarea
                disabled
                // value={valueOrDefault(quoteData.plan_type)}
                className="text-center font-semibold resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
              />
            </div>
            <hr className="w-full border-t-1 border-gray-500"></hr>

            {objectVisibleQuoteFields.map((objectField) => {
              return (
                <>
                  <div className="flex w-full">
                    <textarea
                      disabled
                      className="text-center resize-none text-sm content-center h-7 w-full bg-transparent border-r focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
                    />
                  </div>

                  {Object.entries(
                    JSON.parse(objectField.json_structure as string),
                  ).map(([subFieldKey, value]) => {
                    // console.log(
                    //   "check this stuff",
                    //   quoteData,
                    //   objectField,
                    //   subFieldKey,
                    // );
                    return (
                      <>
                        <hr className="w-full border-t-1 border-gray-300"></hr>
                        <div className="flex w-full bg-white">
                          <textarea
                            ref={ref3 as any}
                            onClick={() => setTextAreaSelected(true)}
                            onChange={handleQuoteChange(
                              `${objectField.field}.${subFieldKey}`,
                            )}
                            value={valueOrDefault(
                              (quoteData as any)[objectField.field]?.[
                                subFieldKey
                              ],
                            )}
                            className="text-center resize-none text-sm content-center h-7 w-full border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
                          />
                        </div>
                      </>
                    );
                  })}
                  <hr className="w-full border-t-1 border-gray-500"></hr>
                </>
              );
            })}
          </>
        )}

        <div className="flex w-full">
          <textarea
            disabled
            className="font-semibold text-center resize-none text-sm content-center h-7 w-full border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>
        <div className="flex w-full bg-white">
          <textarea
            value={totalValue}
            className="text-center resize-none text-sm content-center h-7 w-full border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
      </div>
    </div>
  );
}
