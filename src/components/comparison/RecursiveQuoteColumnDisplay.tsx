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
};

type HeaderLabelProps = {
  quoteData?: any;
  field: any;
  className?: string;
  isQuoteCard?: boolean;
};

//recursively displays nested header or body quote column based on whether quoteData is passed in
export const RecursiveQuoteColumnDisplay = ({
  field,
  initialExpanded = false,
  quoteData,
  path = "root",
  isQuoteCard = false,
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
  }: HeaderLabelProps) => {
    return (
      <div className={`w-full text-sm ${className}`}>
        {(field.type === "object" ||
          field.label === "Medical Deductible In-Network Individual" ||
          field.label === "Dental Deductible Info" ||
          field.label === "Pharmacy Drug List" ||
          field.label === "Dental Deductible Out-of-Network Family" ||
          field.label === "Out-of-Pocket Max Family" ||
          field.label === "Rate for Family" ||
          field.label === "Pharmacy Tier 4 Deductible") && (
          <hr className="w-full border-b-1 border-gray-500"></hr>
        )}

        <hr
          className={`w-full border-gray-300 ${field.label === "Plan Name" && isQuoteCard ? "border-t-0" : ""}`}
        ></hr>
        <div className="flex items-center justify-start h-12 w-full truncate px-2">
          <p className="break-all font-semibold">
            {["string", "number", "boolean"].includes(field.type) ? (
              isQuoteCard ? (
                quoteData ? (
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
              ([key, nestedField]: any) => (
                <RecursiveQuoteColumnDisplay
                  path={`${path}/${nestedField?.label || "label"}`}
                  key={`${path}/${nestedField?.label || "label"}`}
                  field={nestedField}
                  quoteData={quoteData ? quoteData[key] : undefined}
                  isQuoteCard={isQuoteCard}
                />
              ),
            )}
          </>
        )}
      </div>
    );
  }
};
