// @ts-nocheck
import { RecordCell } from "@/src/components/record/record-table/cell/RecordCell";
import React, { useContext, useRef } from "react";
// import { FaTrash } from "react-icons/fa";
import { RowContext } from "@/src/context/commissions/RowContext";
import { ColumnContext } from "@/src/context/commissions/ColumnContext";
import { CheckboxCell } from "@/src/components/record/record-table/cell/CheckboxCell";
import { isNonUpdatable } from "@/src/types/utils/isNonUpdatable";

type RecordRowProps = {
  visibleFieldDefinitionObjects: PolicyField[];
  onEnter: (newRecord: Record<string, any>) => void;
};

export const RecordRow = ({
  visibleFieldDefinitionObjects,
  onEnter,
}: RecordRowProps) => {
  const {
    row: [row],
  } = useContext(RowContext);

  function handleEnter(field: string, newValue, isRelation?: boolean) {
    const nonUpdatableFields = visibleFieldDefinitionObjects.filter((field) =>
      isNonUpdatable(field),
    );

    const filteredRow = Object.entries(row)
      .filter(([key]) => !nonUpdatableFields.includes(key))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    const fieldTypes = visibleFieldDefinitionObjects.map((field) => field.type);

    if (nonUpdatableFields.includes(field)) {
      alert("Field is calculated and cannot be updated");
      return;
    }
    console.log("enummmmmm");
    if (
      fieldTypes[field] === "double precision" &&
      typeof newValue === "string"
    ) {
      try {
        newValue = parseFloat(newValue);
      } catch {
        throw new Error("invalid value, must pass a number");
      }
    } else if (
      fieldTypes[field] === "double precision[]" &&
      Array.isArray(newValue)
    ) {
      newValue = newValue.map((val) => {
        try {
          return typeof val === "string" ? parseFloat(val) : val;
        } catch {
          throw new Error("Type error in updated field");
        }
      });
    }

    console.log("row update", field, newValue);

    const newRow = { ...filteredRow, [field]: newValue };

    onEnter(newRow);
  }

  return (
    <div className="flex flex-row items-center w-full">
      <CheckboxCell rowId={row.id} />
      {visibleFieldDefinitionObjects.map((field, index) => {
        return (
          <ColumnContext.Provider key={index} value={{ field }}>
            <RecordCell
              isFirstField={index === 0}
              key={index}
              field={field}
              onEnter={handleEnter}
            />
          </ColumnContext.Provider>
        );
      })}
    </div>
  );
};
