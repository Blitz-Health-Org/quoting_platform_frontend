import { fieldsFamilyState } from "@/src/states/fieldsFamilyState";
import { values } from "lodash";
import { useState } from "react";
import { MdOutlineArrowRight } from "react-icons/md";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useRecoilState } from "recoil";

type RecursiveQuoteColumnDisplayProps = {
  field: any;
  initialExpanded?: boolean;
  quoteData?: any;
  path?: string;
};

type HeaderLabelProps = {
  quoteData?: any;
  field: any;
  className?: string;
};

//recursively displays nested header or body quote column based on whether quoteData is passed in
export const RecursiveQuoteColumnDisplay = ({
  field,
  initialExpanded = false,
  quoteData,
  path = "root",
}: RecursiveQuoteColumnDisplayProps) => {
  const [fieldState, setFieldState] = useRecoilState(fieldsFamilyState(path));

  if (fieldState === null) {
    setFieldState({ isExpanded: initialExpanded });
    return;
  }

  const { isExpanded } = fieldState;

  const LabelCell = ({ field, className = "" }: HeaderLabelProps) => {
    console.log("quoteData", quoteData, path, field);
    return (
      <div className={`w-full text-sm flex-grow ${className}`}>
        {field.type === "object" && (
          <hr className="w-full border-t-1 border-gray-500"></hr>
        )}

        <hr className="w-full border-t-1 border-gray-300"></hr>
        <div className="flex items-center justify-between h-7 w-full flex-grow">
          <p className="ml-4 my-1 break-all font-semibold">
            {["string", "number", "boolean"].includes(field.type) ? (
              quoteData ? (
                quoteData
              ) : (
                field.label
              )
            ) : quoteData ? (
              <></>
            ) : (
              field?.label
            )}
          </p>
          {field.type === "object" &&
            (isExpanded ? (
              <div className="pr-2">
                <MdOutlineArrowDropDown
                  onClick={() => {
                    setFieldState((prev: { isExpanded: boolean }) => {
                      return {
                        isExpanded: !prev.isExpanded,
                      };
                    });
                  }}
                />
              </div>
            ) : (
              <div className="pr-2">
                <MdOutlineArrowRight
                  onClick={() => {
                    setFieldState((prev: { isExpanded: boolean }) => {
                      return {
                        isExpanded: !prev.isExpanded,
                      };
                    });
                  }}
                />
              </div>
            ))}
        </div>
      </div>
    );
  };

  if (field.isVisible === false) return <></>;

  if (["string", "number", "boolean"].includes(field.type)) {
    return <LabelCell quoteData={quoteData} field={field} />;
  } else if (field.type === "array") {
    return <></>;
  } else {
    return (
      <div className="flex flex-col flex-grow">
        {field.label && (
          <LabelCell className={"bg-violet-100/60"} field={field} />
        )}
        {isExpanded && (
          <>
            {Object.entries(field["properties"]).map(
              ([key, nestedField]: any) => (
                <RecursiveQuoteColumnDisplay
                  path={`${path}/${nestedField?.label || "label"}`}
                  key={`${path}/${nestedField?.label || "label"}`}
                  field={nestedField}
                  quoteData={quoteData ? quoteData[key] : undefined}
                />
              ),
            )}
          </>
        )}
      </div>
    );
  }
};
