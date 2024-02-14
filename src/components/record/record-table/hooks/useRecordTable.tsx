//TODO: Get rid of vestigial setRows and rely completely on refetch (add deps to useEffect)

import { RecordContext } from "@/src/context/RecordContext";
import { createClient } from "@supabase/supabase-js";
import { Filter } from "@/src/types/custom/Filter";
import { isFieldVisible } from "@/src/metadata/utils/isFieldVisible";
import {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import { PolicyField } from "@/src/metadata/metadata";
import { Database } from "@/src/types/database.types";
import { getRecordFields } from "@/src/components/record/record-table/utils/getRecordFields";
import { useFindRelationIdFieldMappings } from "@/src/components/record/record-table/cell/relation/hooks/useFindRelationIdFieldMappings";

const supabase = createClient<Database>(
  "https://ifaekiywtbedsipmwtkr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYWVraXl3dGJlZHNpcG13dGtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjgyNjU1NCwiZXhwIjoyMDIyNDAyNTU0fQ.37mTjcmzwBWCIm1RIeaREROrnoEFSYAXyFrY48NDCsA",
);

export function useRecordTable(
  tableName: { singular: string; plural: string },
  filters?: Filter[],
  groupFieldObject?: Partial<PolicyField>,
  record?: [any[], Dispatch<SetStateAction<any[]>>],
) {
  const [visibleFieldDefinitionObjects, setvisibleFieldDefinitionObjects] =
    useState<PolicyField[]>([]);

  const { record: internalRecord } = useContext(RecordContext);
  const [records, setRecords] = record ?? internalRecord;
  const [loading, setLoading] = useState<boolean>(true);
  const fieldMetadata = useRef<Record<string, PolicyField>>();

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("policies ")
        .select()
        .order("id");
      if (!error) {
        console.log("setted here");
        setRecords(data as any);
        fieldMetadata.current = getRecordFields(tableName.plural.toLowerCase()); // hardcoded

        const visibleFieldDefinitionObjects = fieldMetadata.current
          ? Object.values(fieldMetadata.current).filter((value: any) =>
              isFieldVisible(value),
            )
          : [];
        setvisibleFieldDefinitionObjects(visibleFieldDefinitionObjects);
        setLoading(false);
      } else {
        console.error(error);
      }
    }
    fetchData();
  }, [setRecords, tableName.plural]);

  const validRecords = records.filter((record) => {
    const date = new Date(record.created_at);
    if (isNaN(date.getTime())) {
      return false;
    }

    for (const key in record) {
      if (record.hasOwnProperty(key)) {
        if (record[key] === undefined) {
          return false;
        }
      }
    }

    return true;
  });

  const dateSortedRecords = validRecords.sort((recordA, recordB) => {
    return (
      new Date(recordB.created_at).getTime() -
      new Date(recordA.created_at).getTime()
    );
  });

  let filteredRecords = dateSortedRecords;
  if (filters) {
    for (const filter of filters) {
      if (filter.value) {
        console.log("check check", filteredRecords, filter);
        filteredRecords = filteredRecords.filter(
          (record: Record<string, any>) => {
            return record[filter.field] === filter.value;
          },
        );
      }
    }
  }

  let groupedFilteredRecords: Record<string, Record<string, any>[]> = {};

  const completeGroupFieldObject = visibleFieldDefinitionObjects.find(
    (fieldDefinitionObject) => {
      return (
        fieldDefinitionObject.label === groupFieldObject?.label &&
        fieldDefinitionObject.field === groupFieldObject?.field
      );
    },
  );
  const { relationIdFieldMappings } = useFindRelationIdFieldMappings(
    groupFieldObject?.field && record
      ? record.map((record) => (record as any)[groupFieldObject.field as any])
      : undefined,
    completeGroupFieldObject,
  );

  console.log("groupFieldObject", groupFieldObject);
  const groupField = groupFieldObject?.field ?? "client";
  filteredRecords.forEach((record) => {
    // const groupIdValue = (record as any)[groupField as any];
    // const mapping = relationIdFieldMappings?.find(
    //   (mapping) =>
    //     mapping?.[completeGroupFieldObject?.relationIdField as any] ===
    //     groupIdValue,
    // );
    // const groupValue =
    //   mapping?.[completeGroupFieldObject?.relationLabel as any];
    const groupValue = record[groupField];
    if (
      groupValue !== null &&
      typeof groupValue !== "undefined" &&
      !(typeof groupValue === "object" && Object.keys(groupValue).length === 0)
    ) {
      if (!groupedFilteredRecords[groupValue]) {
        groupedFilteredRecords[groupValue] = [];
      }
      groupedFilteredRecords[groupValue].push(record);
    }
  });

  return {
    records,
    setRecords,
    filteredRecords,
    groupedFilteredRecords,
    visibleFieldDefinitionObjects,
    loading,
  };
}
