import * as React from "react";
import Image from "next/image";
import Apple from "@/public/Screenshot.png";
import { QuoteType } from "@/src/types/custom/Quote";
import { NonSystemField } from "@/src/types/metadata";

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
  function valueOrDefault(val: any, def: string = "N/A") {
    return val ?? def;
  }

  if (quote.name === "Aetna") {
    console.log("aetna", quote.deductibles.in.medical);
  }

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
          <h1 className="font-bold text-xl">{quote?.name}</h1>
          <p className="text-sm">{quote?.website}</p>
        </div>
      </div>

      <div className="flex flex-col items-center bg-violet-100/60">
        {nonObjectVisibleQuoteFields.map((field) => {
          return (
            <>
              <textarea
                defaultValue={valueOrDefault(quote[field.field])}
                className="text-center resize-none text-sm content-center h-7 w-full bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto rounded-md p-1"
              />
              <hr className="w-full border-t-1 border-gray-300"></hr>
            </>
          );
        })}

        <div className="flex w-full">
          <textarea
            defaultValue={valueOrDefault(quote.plan_type)}
            className="text-center font-semibold resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
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
                        defaultValue={valueOrDefault(
                          quote[objectField.field]?.in[subFieldKey],
                        )}
                        className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
                      />
                      <textarea
                        defaultValue={valueOrDefault(
                          quote[objectField.field]?.oon[subFieldKey],
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
            defaultValue={"$8,780"}
            className="font-semibold text-center resize-none text-sm content-center h-7 w-full border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>
      </div>
    </div>
  );
}
