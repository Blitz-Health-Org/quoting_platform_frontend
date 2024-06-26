//TODO: fix shitty duck-taped code

import { BooleanCell } from "@/src/components/record/record-table/cell/BooleanCell";
import { EnumCell } from "@/src/components/record/record-table/cell/EnumCell";
import { RelationCell } from "@/src/components/record/record-table/cell/relation/RelationCell";
import { TextCell } from "@/src/components/record/record-table/cell/TextCell";
import { useListenClickOutside } from "@/src/components/ui/dropdown/utils/useListenClickOutside";
import { RowContext } from "@/src/context/commissions/RowContext";
import { PolicyField } from "@/src/types/metadata";
import { useContext, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ReadOnlyCell } from "./ReadOnlyCell";
export function RecordCell({
  onEnter,
  field,
  isFirstField,
  statusColor,
}: {
  onEnter: (field: string, newValue: any) => void;
  field: PolicyField;
  isFirstField: boolean;
  statusColor: string;
}) {
  const { row, isUserCreatedRow } = useContext(RowContext);

  const fieldValue = row[field.field];

  const [isCellSelected, setIsCellSelected] = useState<boolean>(
    isUserCreatedRow && isFirstField ? true : false,
  );

  const ref = useRef() as any;
  const relationRef = useRef() as any;

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
    refs: [ref, relationRef],
    callback: async (event) => {
      if (isCellSelected) {
        // event.stopImmediatePropagation();
        setIsCellSelected(false);
        if ((ref?.current as any).value) {
          onEnter(field.field, ref.current.value);
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

  return (
    <div
      className={`min-w-32 ${statusColor}`}
      onClick={() => {
        setIsCellSelected(true);
      }}
    >
      {field.isCalculated ? (
        <ReadOnlyCell
          setRefs={setRefs}
          isFirstField={isFirstField}
          isUserCreatedRow={isUserCreatedRow}
          defaultValue={fieldValue}
        />
      ) : field.isRelation ? (
        <RelationCell
          setRefs={setRefs}
          isFirstField={isFirstField}
          isUserCreatedRow={isUserCreatedRow}
          relationObject={fieldValue}
          field={field}
          onEnter={onEnter}
          isCellSelected={isCellSelected}
          setIsCellSelected={setIsCellSelected}
        />
      ) : field.type === "enum" ? (
        <EnumCell
          isCellSelected={isCellSelected}
          setIsCellSelected={setIsCellSelected}
          setRefs={setRefs}
          isFirstField={isFirstField}
          isUserCreatedRow={isUserCreatedRow}
          defaultValue={fieldValue}
          onEnter={onEnter}
          field={field}
        />
      ) : (
        <TextCell
          setRefs={setRefs}
          isFirstField={isFirstField}
          isUserCreatedRow={isUserCreatedRow}
          defaultValue={fieldValue}
        />
      )}
    </div>
  );
}
