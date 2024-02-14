import { PolicyField } from "@/src/metadata/metadata";
import { createClient } from "@supabase/supabase-js";
import { debounce } from "lodash";
import { useEffect, useState } from "react";

const supabase = createClient(
  "https://ifaekiywtbedsipmwtkr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYWVraXl3dGJlZHNpcG13dGtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjgyNjU1NCwiZXhwIjoyMDIyNDAyNTU0fQ.37mTjcmzwBWCIm1RIeaREROrnoEFSYAXyFrY48NDCsA",
);

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
