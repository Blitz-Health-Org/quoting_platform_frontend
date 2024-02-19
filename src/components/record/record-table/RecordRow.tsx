// @ts-nocheck
import { RecordCell } from "@/src/components/record/record-table/cell/RecordCell";
import React, { useContext, useRef } from "react";
// import { FaTrash } from "react-icons/fa";
import { RowContext } from "@/src/context/commissions/RowContext";
import { ColumnContext } from "@/src/context/commissions/ColumnContext";
import { CheckboxCell } from "@/src/components/record/record-table/cell/CheckboxCell";
import { isNonUpdatable } from "@/src/types/utils/isNonUpdatable";
import { parseStrictFloat } from "./utils/parseStrictFloat";
import { RecordContext } from "@/src/context/commissions/RecordContext";
import _ from "lodash";

type RecordRowProps = {
  visibleFieldDefinitionObjects: PolicyField[];
  onEnter: (newRecord: Record<string, any>) => void;
};

export const RecordRow = ({
  visibleFieldDefinitionObjects,
  onEnter,
}: RecordRowProps) => {
  const { row } = useContext(RowContext);
  const {
    record: [records],
  } = useContext(RecordContext);

  function handleEnter(field: string, newValue, isRelation?: boolean) {
    const nonUpdatableFields = visibleFieldDefinitionObjects.filter((field) =>
      isNonUpdatable(field),
    );
    const nonUpdatableFieldNames = nonUpdatableFields.map(
      (field) => field.field,
    );

    let updatedRecord = { ...row, [field]: newValue };

    let oldRecord = records.find(
      (record) => record.id === updatedRecord.id,
    ) as any;

    console.log("old and new", oldRecord, updatedRecord);
    if (
      nonUpdatableFieldNames.includes(field) &&
      !_.isEqual(oldRecord, updatedRecord)
    ) {
      alert("Field is calculated and cannot be updated");
      return;
    }

    if (_.isEqual(oldRecord, updatedRecord)) {
      console.log("No changes detected. Update aborted.");
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

    onEnter(updatedRecord);
  }

  return (
    <div
      className={`flex flex-row items-center w-full ${
        row.status === "Resolved"
          ? "bg-green-300"
          : row.status === "Unresolved"
            ? "bg-red-300"
            : "bg-yellow-300"
      }`}
    >
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
