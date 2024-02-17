import { CheckboxAllCell } from "@/src/components/record/record-table/cell/CheckBoxAllCell";
import { RecordTableHeaderCell } from "@/src/components/record/record-table/cell/RecordTableHeaderCell";
import { RecordContext } from "@/src/context/commissions/RecordContext";
import { useContext } from "react";

export function RecordTableHeader() {
  const {
    visibleFieldDefinitionObjects: [visibleFieldDefinitionObjects],
  } = useContext(RecordContext);

  if (!visibleFieldDefinitionObjects) {
    return;
  }

  return (
    <>
      <div className="flex flex-row items-center w-full h-full">
        {visibleFieldDefinitionObjects.length > 0 && (
          <>
            <CheckboxAllCell />
            {visibleFieldDefinitionObjects.map((field: any, index: any) => (
              <RecordTableHeaderCell field={field} key={index} />
            ))}
          </>
        )}
      </div>
    </>
  );
}
