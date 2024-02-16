import * as React from "react";
import Image from "next/image";
import Apple from "../../public/Screenshot.png";
import { FieldType, NonSystemField } from "@/src/types/metadata";

export type LeftProps = {
  nonObjectVisibleQuoteFields: NonSystemField[];
  objectVisibleQuoteFields: NonSystemField[];
};

export default function Left({
  nonObjectVisibleQuoteFields,
  objectVisibleQuoteFields,
}: LeftProps) {
  const topLevelItemList = nonObjectVisibleQuoteFields.map(
    (field) => field.label,
  );

  return (
    <div className="bg-white h-fit min-w-56 mt-4 rounded-lg outline outline-1 outline-gray-300 py-6 text-center truncate">
      <div className="flex mb-16"></div>
      <div className="w-full text-sm">
        {topLevelItemList.map((item: any, index: any) => (
          <div key={index}>
            <hr className="w-full border-t-1 border-gray-300"></hr>
            <div className="flex items-center h-7 bg-violet-100/60 w-full">
              <p className="ml-4 my-1 break-all font-semibold">{item}</p>
            </div>
          </div>
        ))}
        <div>
          <hr className="w-full border-t-1 border-gray-300"></hr>
          <div className="flex items-center h-7 bg-violet-100/60 w-full">
            <p className="ml-4 my-1 break-all font-semibold">Network Status</p>
          </div>
        </div>
        <hr className="w-full border-t-1 border-gray-500"></hr>

        {objectVisibleQuoteFields.map((field) => {
          return (
            <>
              <div className="flex items-center h-7 bg-violet-100/60 w-full">
                <p className="ml-4 break-all font-semibold">{field.label}</p>
              </div>

              {Object.entries(JSON.parse(field.json_structure as string)).map(
                ([key, value]: any, index: any) => (
                  <div key={index}>
                    <hr className="w-full border-t-1 border-gray-300"></hr>
                    <div className="flex items-center bg-white w-full h-7">
                      <p className="ml-4 break-all">{value.label}</p>
                    </div>
                  </div>
                ),
              )}
              <hr className="w-full border-t-1 border-gray-500"></hr>
            </>
          );
        })}

        <div className="flex items-center h-7 bg-violet-100/60 w-full">
          <p className="ml-4 my-1 break-all font-semibold">Total Cost</p>
        </div>
      </div>
    </div>
  );
}
