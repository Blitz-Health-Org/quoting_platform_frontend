//specific to status currently

import { Dropdown } from "@/src/components/ui/dropdown/Dropdown";
import { TableCellDropdown } from "@/src/components/ui/dropdown/TableCellDropdown";
import { PolicyField } from "@/src/types/metadata";
import { Dispatch, SetStateAction, useState } from "react";

const enumValues = ["Resolved", "Unresolved"];

type EnumCellProps = {
  setRefs: any;
  isUserCreatedRow: boolean;
  isFirstField: boolean;
  defaultValue: string;
  onEnter: (field: string, newValue: any) => void;
  field: PolicyField;
  isCellSelected: boolean;
  setIsCellSelected: Dispatch<SetStateAction<boolean>>;
};

export const EnumCell = ({
  setRefs,
  isUserCreatedRow,
  isFirstField,
  defaultValue,
  onEnter,
  isCellSelected,
  setIsCellSelected,
  field,
}: EnumCellProps) => {
  // console.log("iscellselected", isCellSelected);
  return (
    <TableCellDropdown
      setRefs={setRefs}
      setIsCellSelected={setIsCellSelected}
      clickableComponent={
        <textarea
          autoFocus={isUserCreatedRow && isFirstField}
          className="block bg-transparent border-l-0 border-t-0 hover:border-l hover:border-t focus:border-t focus:border-l focus:z-10 resize-none cursor-pointer focus:outline-0 focus:border-gray-400 hover:border-gray-400/80 focus:cursor-auto h-7 text-sm border border-1 border-gray-200 w-full py-0.5 px-1 z-0 hover:rounded-md focus:rounded-md"
          value={defaultValue}
        />
      }
      dropdownComponents={
        <>
          {isCellSelected && (
            <div className="flex flex-col border border-black">
              {enumValues.map((enumValue, index) => (
                <button
                  onClick={() => {
                    onEnter(field.field, enumValue);
                  }}
                  key={index}
                >
                  {enumValue}
                </button>
              ))}
            </div>
          )}
        </>
      }
    />
  );
};
