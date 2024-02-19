//specific to status currently

import { Dropdown } from "@/src/components/ui/dropdown/Dropdown";
import { PolicyField } from "@/src/types/metadata";
import { useState } from "react";

const enumValues = ["Resolved", "Unresolved"];

type EnumCellProps = {
  setRefs: any;
  isUserCreatedRow: boolean;
  isFirstField: boolean;
  defaultValue: string;
  onEnter: (field: string, newValue: any) => void;
  field: PolicyField;
};

export const EnumCell = ({
  setRefs,
  isUserCreatedRow,
  isFirstField,
  defaultValue,
  onEnter,
  field,
}: EnumCellProps) => {
  return (
    <Dropdown
      collapseOnClick
      clickableComponent={
        <textarea
          ref={setRefs}
          autoFocus={isUserCreatedRow && isFirstField}
          className="block bg-transparent border-l-0 border-t-0 hover:border-l hover:border-t focus:border-t focus:border-l focus:z-10 resize-none cursor-pointer focus:outline-0 focus:border-gray-400 hover:border-gray-400/80 focus:cursor-auto h-7 text-sm border border-1 border-gray-200 w-full py-0.5 px-1 z-0 hover:rounded-md focus:rounded-md"
          value={defaultValue}
        />
      }
      dropdownComponents={
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
      }
    />
  );
};
