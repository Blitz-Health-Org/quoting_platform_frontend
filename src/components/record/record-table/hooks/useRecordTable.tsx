import { RecordContext } from "@/src/context/commissions/RecordContext";
import { Filter } from "@/src/types/custom/Filter";
import { useState, useEffect, useContext } from "react";
import { PolicyField } from "@/src/types/metadata";
import { Database } from "@/src/types/database/database.types";
import { isFieldVisible } from "@/src/types/utils/isFieldVisible";
import { getRecordFields } from "../utils/getRecordFields";
import { collapsedVisibleFields } from "../constants/collapsedVisibleFields";
import { supabase } from "@/src/supabase";

export function useRecordTable(
  tableName: { singular: string; plural: string },
  filters?: Filter[],
  groupFieldObject?: Partial<PolicyField>,
) {
  const {
    record,
    filteredRecords: [, setFilteredRecords],
    groupedFilteredRecords: [, setGroupedFilteredRecords],
    visibleFieldDefinitionObjects: [, setVisibleFieldDefinitionObjects],
    expanded: [isExpanded],
  } = useContext(RecordContext);
  const [records, setRecords] = record;
  const [loading, setLoading] = useState<boolean>(true);

  //FETCH RECORDS
  useEffect(() => {
    async function fetchData() {
      if (!records) {
        const supabaseTableName = tableName.plural.toLowerCase();

        const { data, error } = await supabase
          .from(supabaseTableName)
          .select()
          .order("id");
        if (!error) {
          const validRecords = data.filter((record) => {
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
          setRecords(dateSortedRecords as any);

          let internalFilteredRecords = dateSortedRecords;
          if (filters) {
            for (const filter of filters) {
              if (filter.value) {
                internalFilteredRecords = internalFilteredRecords.filter(
                  (record: Record<string, any>) => {
                    return record[filter.field] === filter.value;
                  },
                );
              }
            }
          }
          console.log("does this not rung");
          setFilteredRecords(internalFilteredRecords);

          setLoading(false);
        } else {
          console.error(error);
        }
      } else {
        let internalFilteredRecords = records;
        if (filters) {
          for (const filter of filters) {
            if (filter.value) {
              internalFilteredRecords = internalFilteredRecords.filter(
                (record: Record<string, any>) => {
                  return record[filter.field] === filter.value;
                },
              );
            }
          }
        }
        setFilteredRecords(internalFilteredRecords);

        setLoading(false);
      }
    }

    fetchData();

    //SET FIELD METADATA
    const fieldMetadata = getRecordFields(tableName.plural.toLowerCase());

    const visibleFieldDefinitionObjects = isExpanded
      ? fieldMetadata
        ? Object.values(fieldMetadata).filter((value: any) =>
            isFieldVisible(value),
          )
        : []
      : collapsedVisibleFields;

    setVisibleFieldDefinitionObjects(visibleFieldDefinitionObjects);
  }, [
    filters,
    isExpanded,
    records,
    setFilteredRecords,
    setRecords,
    setVisibleFieldDefinitionObjects,
    tableName.plural,
  ]);

  let internalGroupedFilteredRecords: any = {};

  // setGroupedFilteredRecords({});

  // const completeGroupFieldObject = visibleFieldDefinitionObjects.find(
  //   (fieldDefinitionObject) => {
  //     return (
  //       fieldDefinitionObject.label === groupFieldObject?.label &&
  //       fieldDefinitionObject.field === groupFieldObject?.field
  //     );
  //   },
  // );
  // const { relationIdFieldMappings } = useFindRelationIdFieldMappings(
  //   groupFieldObject?.field && record
  //     ? record.map((record) => (record as any)[groupFieldObject.field as any])
  //     : undefined,
  //   completeGroupFieldObject,
  // );

  // console.log("groupFieldObject", groupFieldObject);
  // const groupField = groupFieldObject?.field ?? "client";
  // filteredRecords.forEach((record) => {
  //   // const groupIdValue = (record as any)[groupField as any];
  //   // const mapping = relationIdFieldMappings?.find(
  //   //   (mapping) =>
  //   //     mapping?.[completeGroupFieldObject?.relationIdField as any] ===
  //   //     groupIdValue,
  //   // );
  //   // const groupValue =
  //   //   mapping?.[completeGroupFieldObject?.relationLabel as any];
  //   const groupValue = record[groupField];
  //   if (
  //     groupValue !== null &&
  //     typeof groupValue !== "undefined" &&
  //     !(typeof groupValue === "object" && Object.keys(groupValue).length === 0)
  //   ) {
  //     if (!groupedFilteredRecords[groupValue]) {
  //       groupedFilteredRecords[groupValue] = [];
  //     }
  //     groupedFilteredRecords[groupValue].push(record);
  //   }
  // });

  return {
    loading,
  };
}
