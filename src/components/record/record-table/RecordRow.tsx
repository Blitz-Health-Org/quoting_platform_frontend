// @ts-nocheck
import { RecordCell } from "@/src/components/record/record-table/cell/RecordCell";
import React, { useContext, useRef } from "react";
// import { FaTrash } from "react-icons/fa";
import { RowContext } from "@/src/context/commissions/RowContext";
import { ColumnContext } from "@/src/context/commissions/ColumnContext";
import { CheckboxCell } from "@/src/components/record/record-table/cell/CheckboxCell";
import { isNonUpdatable } from "@/src/types/utils/isNonUpdatable";
import { parseStrictFloat } from "./utils/parseStrictFloat";

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

    if (nonUpdatableFields.includes(field)) {
      alert("Field is calculated and cannot be updated");
      return;
    }

    const fieldDefinition = visibleFieldDefinitionObjects.find(
      (fieldObject) => fieldObject.field === field,
    );

    if (
      fieldDefinition.type === "double precision" &&
      typeof newValue === "string"
    ) {
      try {
        console.log("new val here", newValue);
        newValue = parseStrictFloat(newValue);
      } catch {
        alert(
          `Must pass a number to ${field} field. Non-numeric changes will not be saved`,
        );
        return;
      }
    } else if (
      fieldDefinition.type === "double precision[]" &&
      Array.isArray(newValue)
    ) {
      newValue = newValue.map((val) => {
        try {
          return typeof val === "string" ? parseFloat(val) : val;
        } catch {
          alert("Type error in updated field");
          return;
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
