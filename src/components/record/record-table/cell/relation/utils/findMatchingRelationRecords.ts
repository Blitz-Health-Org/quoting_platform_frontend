import { supabase } from "@/src/supabase";
import { Database } from "@/src/types/database/database.types";
import { filter } from "lodash";

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
