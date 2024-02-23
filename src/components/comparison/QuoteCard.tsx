import { useRef, useState } from "react";
import Image from "next/image";
import Apple from "@/public/Screenshot.png";
import { QuoteType } from "@/src/types/custom/Quote";
import { NonSystemField } from "@/src/types/metadata";
import { supabase } from "@/src/supabase";
import { useListenClickOutside } from "../ui/dropdown/utils/useListenClickOutside";
import { valueOrDefault } from "chart.js/dist/helpers/helpers.core";

type QuoteCardProps = {
  quote: QuoteType;
  nonObjectVisibleQuoteFields: NonSystemField[];
  objectVisibleQuoteFields: NonSystemField[];
};

export default function QuoteCard({
  quote,
  nonObjectVisibleQuoteFields,
  objectVisibleQuoteFields,
}: QuoteCardProps) {
  const [internalQuote, setInternalQuote] = useState<QuoteType>(quote);

  const [textAreaSelected, setTextAreaSelected] = useState<boolean>(false);
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  const totalValue = ""; //implement calculation

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

      // Update the internalQuote using the recursive function
      const updatedQuote = updateNestedObject(
        internalQuote,
        pathParts,
        newValue,
      );

      // Update the state with the new quote
      setInternalQuote(updatedQuote);
    };
  }

  useListenClickOutside({
    refs: [ref1 as any, ref2 as any, ref3 as any],
    callback: async (event) => {
      // SEND DATA
      try {
        const { data, error } = await supabase
          .from("quotes") // Replace with your actual table name
          .upsert(internalQuote);

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
    <div className="bg-white h-full mb-4 min-w-80 mt-4 rounded-lg outline outline-1 outline-gray-300 py-6 mr-1 text-center overscroll-none">
      <div className="flex w-full justify-center h-16">
        <div className="w-fit">
          <Image
            src={Apple} //TODO: provide defaultImage, make this default in the suapbase not case catching on the fe
            alt="Description of the image"
            width={50}
            height={40}
            className="mr-2 rounded-md"
          />
        </div>
        <div className="flex flex-col w-fit justify-center items-start ml-1 mb-4">
          <h1 className="font-bold text-xl">{internalQuote?.name}</h1>
          <p className="text-sm">{internalQuote?.website}</p>
        </div>
      </div>

      <div className="flex flex-col items-center bg-violet-100/60">
        {nonObjectVisibleQuoteFields
          .filter(
            (field) => field.field !== "name" && field.field !== "website",
          )
          .map((field) => {
            console.log("field", field.field, internalQuote);
            return (
              <>
                <textarea
                  ref={ref1 as any}
                  onClick={() => setTextAreaSelected(true)}
                  onChange={handleQuoteChange(field.field)}
                  value={valueOrDefault((internalQuote as any)[field.field])}
                  className="text-center resize-none text-sm content-center h-7 w-full bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto rounded-md p-1"
                />
                <hr className="w-full border-t-1 border-gray-300"></hr>
              </>
            );
          })}

        <div className="flex w-full">
          <textarea
            disabled
            value={valueOrDefault(internalQuote.plan_type)}
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
                          (internalQuote as any)[objectField.field]?.in?.[subFieldKey],
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
                          (internalQuote as any)[objectField.field]?.oon?.[subFieldKey],
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

        <div className="flex w-full">
          <textarea
            defaultValue={totalValue}
            className="font-semibold text-center resize-none text-sm content-center h-7 w-full border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>
      </div>
    </div>
  );
}
