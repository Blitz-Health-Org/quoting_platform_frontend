"use client";

import { createContext, useEffect } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";
import { supabase } from "../supabase";
import { useState } from "react";
import { useGetUserData } from "../utils/useGetUserData";
import { Loading } from "../components/ui/Loading";

export type UserContextProps = {
  userId: [string | undefined, (value: string | undefined) => void, boolean];
};

export const UserContext = createContext<UserContextProps>({
  userId: [undefined, () => {}, true],
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userId, setUserId, loading] = useLocalStorage<string | undefined>(
    "userId",
    undefined,
  );

  const { userData, loadingUserData } = useGetUserData();

  useEffect(() => {
    if (userData && !userId) {
      setUserId(userData.user_auth_id);
    }
  }, [userData, userId, setUserId]);

  if (loading || loadingUserData) return <Loading />;

  return (
    <>
      <UserContext.Provider
        value={{
          userId: [userId, setUserId, loading],
        }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
};
