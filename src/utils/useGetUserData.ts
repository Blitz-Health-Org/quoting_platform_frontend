import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useLocalStorage } from "./useLocalStorage";

interface userDataType {
  id: string;
  user_auth_id: string;
  permissions: string;
  organization_id: string;
}

export function useGetUserData() {
  const [userData, setUserData] = useState<userDataType>({
    id: "",
    user_auth_id: "",
    permissions: "",
    organization_id: "",
  });
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [loadingUserData, setLoading] = useState(true);

  const [accessToken, setAccessToken, accessTokenLoading] = useLocalStorage<
    string | undefined
  >("accessToken", undefined);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserId = async () => {
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error) {
      console.error("Error getting user:", error);
    } else {
      setUserId(data.user.id);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserData = async () => {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("user_auth_id", userId);
    if (error) {
      console.error("Error fetching permissions:", error);
    } else {
      setUserData(data[0]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && !userId) getUserId();
    if (userId && loadingUserData) getUserData();
  }, [userId, loadingUserData, getUserData, accessToken, getUserId]);

  return { userData, loadingUserData };
}
