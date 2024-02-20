//disable filter or groupby

import { RecordRow } from "@/src/components/record/record-table/RecordRow";
import { RowContextProvider } from "@/src/context/commissions/RowContext";
import { Dispatch, SetStateAction, useContext } from "react";
import { TableGroupHeader } from "@/src/components/record/record-table/group-by/components/TableGroupHeader";
import { TableGroupAggregationRow } from "@/src/components/record/record-table/group-by/TableGroupAggregationRow";
import { Database } from "@/src/types/database/database.types";
import { ActionBar } from "@/src/components/record/record-table/ActionBar";
import { PolicyField } from "@/src/types/metadata";
import { isNonUpdatable } from "@/src/types/utils/isNonUpdatable";
import { RecordContext } from "@/src/context/commissions/RecordContext";
import { isFieldVisible } from "@/src/types/utils/isFieldVisible";
import { collapsedVisibleFields } from "./constants/collapsedVisibleFields";
import { getRecordFields } from "./utils/getRecordFields";
import { supabase } from "@/src/supabase";

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

  const { tableName } = useContext(RecordContext);

  async function deleteRecords() {
    setRecords(records.filter((record) => !checkedBoxIds.includes(record.id)));
    const { error } = await supabase
      .from(tableName.plural)
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
      .from(tableName.plural)
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

    const fieldMetadata = getRecordFields(tableName.plural.toLowerCase());

    const totalVisibleFieldDefinitionObjects = fieldMetadata
      ? Object.values(fieldMetadata).filter((value: any) =>
          isFieldVisible(value),
        )
      : [];

    const nonUpdatableFields = totalVisibleFieldDefinitionObjects.filter(
      (field) => isNonUpdatable(field),
    );
    const nonUpdatableFieldNames = nonUpdatableFields.map(
      (field) => field.field,
    );

    console.log(
      "updatedRecord",
      Object.entries(updatedRecord),
      nonUpdatableFieldNames,
    );
    updatedRecord = Object.entries(updatedRecord)
      .filter(([key]) => !nonUpdatableFieldNames.includes(key))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    await supabase
      .from(tableName.plural)
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
      <div className="bg-white flex flex-col gap-0 h-96">
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
      <div className="flex flex-col gap-0 h-96">
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
