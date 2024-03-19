import { fieldsFamilyState } from "@/src/states/fieldsFamilyState";
import { MdOutlineArrowRight } from "react-icons/md";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useRecoilState } from "recoil";

type RecursiveQuoteColumnDisplayProps = {
  field: any;
  initialExpanded?: boolean;
  quoteData?: any;
  path?: string;
  isQuoteCard?: boolean;
  calculatedTotalCost?: any;
  alternateColor?: boolean;
};

type HeaderLabelProps = {
  quoteData?: any;
  field: any;
  className?: string;
  isQuoteCard?: boolean;
  alternateColor?: boolean;
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
    alternateColor = false,
  }: HeaderLabelProps) => {
    return (
      <div
        className={`w-full text-sm ${className} ${!alternateColor && isQuoteCard ? "bg-gray-100" : "bg-white"}`}
      >
        {field.type === "object" && (
          <hr className="w-full border-b-1 border-gray-500"></hr>
        )}

        <hr
          className={`w-full border-gray-300 ${field.label === "Plan Name" && isQuoteCard ? "border-t-0" : ""}`}
        ></hr>
        <div
          className={`w-full flex items-center ${isQuoteCard ? "justify-center" : "justify-start"} h-10 w-full overflow-x-scroll text-nowrap px-3`}
        >
          <p className="break-all font-semibold max-w-64">
            {["string", "number", "boolean"].includes(field.type) ? (
              isQuoteCard ? (
                quoteData !== null && quoteData !== undefined ? (
                  quoteData
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
    return (
      <LabelCell
        isQuoteCard={isQuoteCard}
        quoteData={quoteData}
        field={field}
        alternateColor={alternateColor}
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
          />
        )}
        {isExpanded && (
          <>
            {Object.entries(field["properties"]).map(
              ([key, nestedField]: any, index: number) => (
                <RecursiveQuoteColumnDisplay
                  path={`${path}/${nestedField?.label || "label"}`}
                  key={`${path}/${nestedField?.label || "label"}`}
                  field={nestedField}
                  quoteData={quoteData ? quoteData[key] : undefined}
                  isQuoteCard={isQuoteCard}
                  alternateColor={index % 2 === 1}
                />
              ),
            )}
            {isQuoteCard ? (
              <RecursiveQuoteColumnDisplay
                field={{ type: "string", label: "Total Monthly Cost" }}
                isQuoteCard
                quoteData={calculatedTotalCost}
              />
            ) : (
              <RecursiveQuoteColumnDisplay
                field={{ type: "string", label: "Total Monthly Cost" }}
              />
            )}
          </>
        )}
      </div>
    );
  }
};
