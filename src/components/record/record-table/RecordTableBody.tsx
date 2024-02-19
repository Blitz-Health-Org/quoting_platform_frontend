//disable filter or groupby

import { RecordRow } from "@/src/components/record/record-table/RecordRow";
import { RowContextProvider } from "@/src/context/commissions/RowContext";
import { Dispatch, SetStateAction, useContext } from "react";
import { TableGroupHeader } from "@/src/components/record/record-table/group-by/components/TableGroupHeader";
import { TableGroupAggregationRow } from "@/src/components/record/record-table/group-by/TableGroupAggregationRow";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/src/types/database/database.types";
import { ActionBar } from "@/src/components/record/record-table/ActionBar";
import { PolicyField } from "@/src/types/metadata";
import { isNonUpdatable } from "@/src/types/utils/isNonUpdatable";
import { RecordContext } from "@/src/context/commissions/RecordContext";

//TODO: extract supabase
const supabase = createClient<Database>(
  "https://ifaekiywtbedsipmwtkr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYWVraXl3dGJlZHNpcG13dGtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjgyNjU1NCwiZXhwIjoyMDIyNDAyNTU0fQ.37mTjcmzwBWCIm1RIeaREROrnoEFSYAXyFrY48NDCsA",
);

type RecordTableBodyProps = {
  visibleFieldDefinitionObjects: PolicyField[];
  record: [
    Record<string, any>[],
    React.Dispatch<React.SetStateAction<Record<string, any>[]>>,
  ];
  userCreatedRecord: [boolean, Dispatch<SetStateAction<boolean>>];
  filteredRecords: any[];
  groupedFilteredRecords: Record<string, Record<string, any>[]>;
  groupFieldObject: Partial<PolicyField>;
  checked: [number[], Dispatch<SetStateAction<number[]>>];
};

export const RecordTableBody = ({
  visibleFieldDefinitionObjects,
  userCreatedRecord,
  filteredRecords,
  record,
  groupedFilteredRecords,
  groupFieldObject,
  checked,
}: RecordTableBodyProps) => {
  const [records, setRecords] = record;
  const [isUserCreatedRecordActive, setIsUserCreatedRecordActive] =
    userCreatedRecord;
  const [checkedBoxIds, setCheckedBoxIds] = checked;

  async function deleteRecords() {
    setRecords(records.filter((record) => !checkedBoxIds.includes(record.id)));
    const { error } = await supabase
      .from("policies")
      .delete()
      .in("id", checkedBoxIds);
    setCheckedBoxIds([] as any);
  }

  async function handleCreateNewRecord(newRecord: Record<string, any>) {
    //manually checking for now
    const isAllFieldsEmpty = Object.keys(newRecord).every((key) => {
      if (key === "created_at" || key === "id") return true;
      const value = newRecord[key];
      return (
        value === "" ||
        value === null ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" && Object.keys(value).length === 0)
      );
    });

    if (isAllFieldsEmpty) {
      return;
    }

    setRecords([newRecord, ...records]);

    const { error } = await supabase
      .from("policies")
      .insert(newRecord)
      .select();

    if (error) {
      throw new Error("error on create new record");
    }

    setIsUserCreatedRecordActive(false);
  }

  async function handleUpdateRecord(updatedRecord: Record<string, any>) {
    setRecords(
      records.map((record) =>
        record.id === updatedRecord.id ? updatedRecord : record,
      ),
    );

    const nonUpdatableFields = visibleFieldDefinitionObjects.filter((field) =>
      isNonUpdatable(field),
    );
    const nonUpdatableFieldNames = nonUpdatableFields.map(
      (field) => field.field,
    );
    updatedRecord = Object.entries(updatedRecord)
      .filter(([key]) => !nonUpdatableFieldNames.includes(key))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    await supabase
      .from("policies")
      .upsert(updatedRecord, { onConflict: "id" })
      .select();
  }

  if (filteredRecords.length === 0) {
    return <div className="w-full text-center">No Records</div>;
  }

  if (groupFieldObject?.label) {
    return Object.entries(groupedFilteredRecords).length === 0 ? (
      <div className="mt-5 text-center">
        {`No groups specified (check that entries exist for ${groupFieldObject.label} column)`}
      </div>
    ) : (
      <div className="bg-white flex flex-col gap-0">
        {Object.entries(groupedFilteredRecords).map(
          ([group, records], index) => {
            return (
              <>
                <TableGroupHeader group={group} key={index} />
                {records.map((row) => (
                  <RowContextProvider initialRow={row} key={row.id}>
                    <RecordRow
                      onEnter={handleUpdateRecord}
                      visibleFieldDefinitionObjects={
                        visibleFieldDefinitionObjects
                      }
                      key={row.id}
                    />
                  </RowContextProvider>
                ))}
                <TableGroupAggregationRow
                  visibleFieldDefinitionObjects={visibleFieldDefinitionObjects}
                  records={records}
                  key={index}
                />
              </>
            );
          },
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-0">
        {isUserCreatedRecordActive && (
          <>
            <RowContextProvider isUserCreatedRow>
              <RecordRow
                visibleFieldDefinitionObjects={visibleFieldDefinitionObjects}
                onEnter={handleCreateNewRecord}
              />
            </RowContextProvider>
          </>
        )}
        {filteredRecords.map((row: any) => (
          <RowContextProvider initialRow={row} key={row.id}>
            <RecordRow
              visibleFieldDefinitionObjects={visibleFieldDefinitionObjects}
              key={row.id}
              onEnter={handleUpdateRecord}
            />
          </RowContextProvider>
        ))}
      </div>
      {checkedBoxIds.length > 0 && <ActionBar deleteRecords={deleteRecords} />}
    </>
  );
};
