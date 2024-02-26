import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export const useSharingCheck = () => {
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);

  async function validateSharingId(sharingId: string) {
    if (!sharingId) {
      setLoading(false);
      return;
    }
    // Check supabase for sharing id
    const { data, error } = await supabase
      .from("links")
      .select()
      .eq("query_id", sharingId);
    if (error) {
      console.error("Error validating sharing id", error);
      setLoading(false);
    } else if (data && data.length > 0) {
      setValid(true);
      setLoading(false);
    }
  }
  useEffect(() => {
    const url = new URL(window.location.href);
    const sharing = url.searchParams.get("sharing");
    validateSharingId(sharing || "");
  }, []);

  return [valid, loading];
};
