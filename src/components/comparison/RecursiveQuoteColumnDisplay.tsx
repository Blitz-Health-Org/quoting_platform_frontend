import { fieldsFamilyState } from "@/src/states/fieldsFamilyState";
import { useContext, useState } from "react";
import { MdOutlineArrowRight } from "react-icons/md";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useRecoilState } from "recoil";
import { PlanGroupContext } from "@/src/context/PlanGroupContext";
import { ClientContext } from "@/src/context/ClientContext";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

type RecursiveQuoteColumnDisplayProps = {
  field: any;
  initialExpanded?: boolean;
  quoteData?: any;
  path?: string;
  isQuoteCard?: boolean;
  calculatedTotalCost?: any;
  alternateColor?: boolean;
  isEditing?: boolean;
  quoteId?: number;
};

type HeaderLabelProps = {
  quoteData?: any;
  field: any;
  className?: string;
  isQuoteCard?: boolean;
  alternateColor?: boolean;
  isEditing?: boolean;
  path: string;
};

//recursively displays nested header or body quote column based on whether quoteData is passed in
export const RecursiveQuoteColumnDisplay = ({
  field,
  initialExpanded = false,
  quoteData,
  path = "root",
  calculatedTotalCost,
  isQuoteCard = false,
  alternateColor = false,
  isEditing,
  quoteId,
}: RecursiveQuoteColumnDisplayProps) => {
  const [fieldState, setFieldState] = useRecoilState(fieldsFamilyState(path));

  if (fieldState === null) {
    setFieldState({ isExpanded: initialExpanded });
    return null;
  }

  const { isExpanded } = fieldState;

  const LabelCell = ({
    isQuoteCard = false,
    field,
    className = "",
    quoteData,
    alternateColor = false,
    // isEditing,
    path,
  }: HeaderLabelProps) => {
    const [editedData, setEditedData] = useState(quoteData);

    const { isEditing, setEditedQuotes } = useContext(PlanGroupContext);

    const { hiddenComparisonFields, sharingId } = useContext(ClientContext);
    console.log("SHARING IN LABEL", sharingId);

    const [hiddenFields, setHiddenFields] = hiddenComparisonFields;

    const fieldPath = path.slice(5).split("/");

    function updateNestedField(obj: any, path: any, newValue: any): any {
      if (path.length === 0) {
        return newValue;
      }

      const [firstPath, ...restPath] = path;
      return {
        ...obj,
        [firstPath]: updateNestedField(
          obj[firstPath] || {},
          restPath,
          newValue,
        ),
      };
    }

    if (sharingId && hiddenFields.includes(field.label)) {
      return <></>;
    }

    return (
      <div
        className={`w-full text-sm ${className} 
        ${ field?.label == "Pharmacy" || field?.label == "Copay" || field?.label == "Rates" || field?.label == "Plan Details" || field?.label == "Total Monthly Cost" ? "bg-violet-100/70"
        : !alternateColor && isQuoteCard ? "bg-gray-100" : "bg-white"}`}
      >
        {field.type === "object" && (
          <hr className="w-full border-b-1 border-gray-500"></hr>
        )}

        <hr
          className={`w-full ${field.label === "Plan Name" && isQuoteCard ? "border-t-0" : ""}
          ${field?.label == "Pharmacy" || field?.label == "Copay" || field?.label == "Rates" || field?.label == "Plan Details" || field?.label == "Total Monthly Cost" ? "border-gray-400" : "border-gray-300"}
          `}
        ></hr>
        <div
          className={`w-full flex items-center ${hiddenFields.includes(field.label) && "bg-gray-200 text-gray-500 outline-none"} ${isQuoteCard ? "justify-center" : "justify-start"} h-8 w-full overflow-x-auto text-nowrap px-3`}
        >
          {field.type === "object" ? (
            isExpanded ? (
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
            )
          ) : (
            !sharingId &&
            !isQuoteCard &&
            (!hiddenFields.includes(field.label) ? (
              <div className="pr-2 flex items-center">
                <button
                  onClick={() => {
                    console.log("AYO");
                    setHiddenFields([...hiddenFields, field.label]);
                  }}
                >
                  <IoMdEye />
                </button>
              </div>
            ) : (
              <div className="pr-2 flex items-center">
                <button
                  onClick={() => {
                    setHiddenFields(
                      hiddenFields.filter(
                        (label: string) => label !== field.label,
                      ),
                    );
                  }}
                >
                  <IoMdEyeOff />
                </button>
              </div>
            ))
          )}

          {isEditing ? (
            <input
              className={`break-all font-semibold text-center ${isQuoteCard && "border border-gray-300 rounded-sm"} `}
              value={
                ["string", "number", "boolean"].includes(field.type) ? (
                  isQuoteCard ? (
                    editedData !== null && editedData !== undefined ? (
                      editedData
                    ) : (
                      "N/A"
                    )
                  ) : field?.label ? (
                    field?.label
                  ) : (
                    <></>
                  )
                ) : (
                  field?.label
                )
              }
              onChange={(e) => {
                setEditedData(e.target.value);
                setEditedQuotes((prev: any) => {
                  return prev.map((quote: any) => {
                    if (quote.id !== quoteId) {
                      // If it's not the quote we want to update, return it unchanged
                      return quote;
                    } else {
                      // If it is the quote we want to update, use updateNestedField
                      // to produce a new quote object with the updated field
                      return {
                        ...quote,
                        data: updateNestedField(
                          quote.data,
                          fieldPath,
                          e.target.value,
                        ),
                      };
                    }
                  });
                });
              }}
            />
          ) : (

            <p className={`break-all font-semibold max-w-64`}>
              {" "}
              {["string", "number", "boolean"].includes(field.type) ? (
                isQuoteCard ? (
                  editedData !== null && editedData !== undefined ?
                    editedData 
                  : field?.label == "Pharmacy" || field?.label == "Copay" || field?.label == "Rates" || field?.label == "Plan Details" ?
                    "" : "N/A"
                ) : field?.label ? (
                  field?.label
                ) : (
                  <></>
                )
              ) : (
                field?.label
              )}
            </p>
          )}
        </div>
      </div>
    );
  };

  if (field?.isVisible === false) return <></>;

  if (["string", "number", "boolean"].includes(field.type)) {
    return (
      <LabelCell
        isQuoteCard={isQuoteCard}
        quoteData={quoteData}
        field={field}
        alternateColor={alternateColor}
        isEditing={isEditing}
        path={path}
      />
    );
  } else if (field.type === "array") {
    return <></>;
  } else {
    return (
      <div className="flex flex-col flex-grow">
        {field.label && (
          <LabelCell
            isQuoteCard={isQuoteCard}
            className={"bg-violet-100/60"}
            field={field}
            isEditing={isEditing}
            path={path}
          />
        )}
        {isExpanded && (
          <>
            {Object.entries(field["properties"]).map(
              ([key, nestedField]: any, index: number) => (
                <RecursiveQuoteColumnDisplay
                  path={`${path}/${key || "label"}`}
                  key={`${path}/${key || "label"}`}
                  field={nestedField}
                  quoteData={quoteData ? quoteData[key] : undefined}
                  isQuoteCard={isQuoteCard}
                  alternateColor={index % 2 === 1}
                  isEditing={isEditing}
                  quoteId={quoteId}
                />
              ),
            )}
            {isQuoteCard ? (
              <RecursiveQuoteColumnDisplay
                field={{ type: "string", label: "Total Monthly Cost" }}
                isQuoteCard
                quoteData={calculatedTotalCost}
                isEditing={isEditing}
                quoteId={quoteId}
              />
            ) : (
              <RecursiveQuoteColumnDisplay
                field={{ type: "string", label: "Total Monthly Cost" }}
                isEditing={isEditing}
                quoteId={quoteId}
              />
            )}
          </>
        )}
      </div>
    );
  }
};
