//TODO: fix shitty duck-taped code

import { BooleanCell } from "@/src/components/record/record-table/cell/BooleanCell";
import { EnumCell } from "@/src/components/record/record-table/cell/EnumCell";
import { RelationCell } from "@/src/components/record/record-table/cell/relation/RelationCell";
import { TextCell } from "@/src/components/record/record-table/cell/TextCell";
import { useListenClickOutside } from "@/src/components/ui/dropdown/utils/useListenClickOutside";
import { RowContext } from "@/src/context/RowContext";
import { PolicyField } from "@/src/types/metadata";
import { useContext, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
export function RecordCell({
  onEnter,
  field,
  isFirstField,
}: {
  onEnter: (field: string, newValue: any) => void;
  field: PolicyField;
  isFirstField: boolean;
}) {
  const {
    row: [row],
    isUserCreatedRow,
  } = useContext(RowContext);

  const fieldValue = row[field.field];

  if (row.id === 6 && field.type === "enum") {
    console.log("fieldValue in recordcell", fieldValue);
  }
  const [isCellSelected, setIsCellSelected] = useState<boolean>(
    isUserCreatedRow && isFirstField ? true : false,
  );

  const ref = useRef() as any;

  const enterRef = useHotkeys(
    "enter",
    (event) => {
      event.preventDefault();
      if (isCellSelected) {
        setIsCellSelected(false);
        if (enterRef.current) enterRef.current.blur();
        onEnter(field.field, (event.target as any).value);
      }
    },
    {
      enableOnFormTags: ["TEXTAREA"],
    },
  );

  useListenClickOutside({
    refs: [ref],
    callback: async (event) => {
      if (isCellSelected) {
        event.stopImmediatePropagation();
        setIsCellSelected(false);
        if ((event.target as any).value) {
          onEnter(field.field, (event.target as any).value);
        }
      }
    },
    enabled: isCellSelected,
  });

  const setRefs = (element: any) => {
    if (isCellSelected) {
      enterRef.current = element;
      ref.current = element;
    }
  };

  //TODO @VARUN: make this have '...' for overflow, or some sort of ui indication of continuation
  if (field.isRelation) {
    return (
      <div
        className="w-full"
        onClick={() => {
          setIsCellSelected(true);
        }}
      >
        <RelationCell
          setRefs={setRefs}
          isFirstField={isFirstField}
          isUserCreatedRow={isUserCreatedRow}
          idValue={fieldValue}
          field={field}
          onEnter={onEnter}
          isCellSelected={isCellSelected}
        />
      </div>
    );
  } else if (field.type === "enum") {
    return (
      <div
        className="w-full"
        onClick={() => {
          setIsCellSelected(true);
        }}
      >
        <EnumCell
          setRefs={setRefs}
          isFirstField={isFirstField}
          isUserCreatedRow={isUserCreatedRow}
          defaultValue={fieldValue}
          onEnter={onEnter}
          field={field}
        />
      </div>
    );
  } else if (
    field.type === "text" ||
    field.type === "bigint" ||
    field.type === "double precision" ||
    field.type === "jsonb" ||
    field.type === "double precision[]" ||
    field.type === "boolean"
  ) {
    return (
      <div
        className="w-full"
        onClick={() => {
          setIsCellSelected(true);
        }}
      >
        <TextCell
          setRefs={setRefs}
          isFirstField={isFirstField}
          isUserCreatedRow={isUserCreatedRow}
          defaultValue={fieldValue}
        />
      </div>
    );
  } else {
    return (
      <div
        className="w-full"
        onClick={() => {
          setIsCellSelected(true);
        }}
      >
        <TextCell
          setRefs={setRefs}
          isFirstField={isFirstField}
          isUserCreatedRow={isUserCreatedRow}
          defaultValue={""}
        />
      </div>
    );
  }
}
