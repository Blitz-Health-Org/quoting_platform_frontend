import { Dispatch, SetStateAction } from "react";
import { CensusDataType } from "../page";
import { TierType } from "@/src/components/comparison/utils/calculateTotalCost";
import { supabase } from "@/src/supabase";
import { ClientType } from "@/src/types/custom/Client";

export function getCensusData(
  setCensusData: Dispatch<SetStateAction<CensusDataType>>,
) {
  async function handleUpdateCensusData(
    client: ClientType,
    editedCensusData: CensusDataType,
  ) {
    console.log("editedCensusData here", editedCensusData);
    try {
      const { data: censusData, error: censusDataError } = await supabase
        .from("clients")
        .update({
          census_data: editedCensusData,
        })
        .eq("id", client.id)
        .select()
        .single();

      if (censusDataError) {
        throw censusDataError;
      }

      setCensusData(editedCensusData);
    } catch {
      alert("Failed to fetch census data");
    }
  }

  return { handleUpdateCensusData };
}
