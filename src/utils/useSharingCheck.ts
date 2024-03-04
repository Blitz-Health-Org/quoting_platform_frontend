import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export const useSharingCheck = () => {
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);

  async function validateSharingId(clientId: string, sharingId: string) {
    if (!sharingId) {
      setLoading(false);
      return;
    }
    console.log("clientId", clientId);
    // Check supabase for sharing id
    const { data, error } = await supabase
      .from("clients")
      .select()
      .eq("id", clientId);
    console.log("data", data);
    if (error) {
      console.error("Error validating sharing id", error);
      setLoading(false);
    } else if (data && data.length > 0) {
      if (data[0].sharing_id === sharingId) {
        setValid(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }
  useEffect(() => {
    const url = new URL(window.location.href);
    const clientId = url.searchParams.get("clientId");
    const sharing = url.searchParams.get("sharing");
    validateSharingId(clientId || "", sharing || "");
  }, []);

  return [valid, loading];
};
