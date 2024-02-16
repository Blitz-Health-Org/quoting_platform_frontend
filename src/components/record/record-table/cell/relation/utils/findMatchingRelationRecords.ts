import { Database } from "@/src/types/database/database.types";
import { createClient } from "@supabase/supabase-js";
import { filter } from "lodash";

const supabase = createClient<Database>(
  "https://ifaekiywtbedsipmwtkr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYWVraXl3dGJlZHNpcG13dGtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjgyNjU1NCwiZXhwIjoyMDIyNDAyNTU0fQ.37mTjcmzwBWCIm1RIeaREROrnoEFSYAXyFrY48NDCsA",
);

export async function findMatchingRelationRecords(
  relationTable: string | undefined,
  relationIdField: string | undefined,
  relationLabel: string | undefined,
  filter: string | undefined,
) {
  if (relationIdField && relationLabel && relationTable && filter) {
    const { data: matchingRelationRecords, error } = await supabase
      .from(relationTable)
      .select(`${relationIdField}, ${relationLabel}`)
      .eq(relationLabel, filter);

    if (error) {
      console.error(error);
      return [];
    } else {
      return matchingRelationRecords;
    }
  } else {
    return [];
  }
}
