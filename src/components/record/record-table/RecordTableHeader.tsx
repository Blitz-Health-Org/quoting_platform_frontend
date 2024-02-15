import { CheckboxAllCell } from "@/src/components/record/record-table/cell/CheckBoxAllCell";
import { RecordTableHeaderCell } from "@/src/components/record/record-table/cell/RecordTableHeaderCell";
import { useRecordTable } from "@/src/components/record/record-table/hooks/useRecordTable";
import { RecordContext } from "@/src/context/commissions/RecordContext";
import { useContext } from "react";

export function RecordTableHeader() {
  const { tableName } = useContext(RecordContext);
  const { visibleFieldDefinitionObjects } = useRecordTable(tableName);

  if (!visibleFieldDefinitionObjects) {
    return;
  }

  return (
    <>
      <div className="flex flex-row items-center w-full h-full">
        <CheckboxAllCell />
        {visibleFieldDefinitionObjects.map((field: any, index: any) => (
          <RecordTableHeaderCell field={field} key={index} />
        ))}
      </div>
    </>
  );
}
