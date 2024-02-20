import { supabase } from "@/src/supabase";
import { PolicyField } from "@/src/types/metadata";
import error from "next/error";
import { useEffect, useState } from "react";

export const useFindRelationIdFieldMappings = (
  internalIdValues: number[] | undefined,
  field: PolicyField | undefined,
) => {
  const [relationIdFieldMappings, setRelationIdFieldMappings] = useState<any[]>(
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      if (internalIdValues) {
        if (
          field?.relationIdField &&
          field?.relationLabel &&
          field?.relationTable
        ) {
          const { data, error } = await supabase
            .from(field.relationTable)
            .select(`${field.relationLabel}, ${field.relationIdField}`)
            .eq(field.relationIdField, internalIdValues);

          if (!error) {
            setRelationIdFieldMappings(
              data.map((data) => {
                return data?.[field.relationLabel as any];
              }),
            );
          }
        }
      }
    };
    fetchData();
  }, [field, internalIdValues]);

  if (!internalIdValues || !field) {
    return {
      fieldValue: undefined,
      setFieldValue: undefined,
      debouncedSetSearchFilter: undefined,
    };
  }

  return {
    relationIdFieldMappings,
    setRelationIdFieldMappings,
  };
};
