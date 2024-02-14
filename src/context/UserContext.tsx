"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";

export type UserContextProps = {
  userId: [number | undefined, (value: number | undefined) => void];
};

export const UserContext = createContext<UserContextProps>({
  userId: [undefined, () => {}],
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userId, setUserId] = useLocalStorage<number | undefined>(
    "blume_user_id",
    -1,
  ); //TODO: Fix this janky ass solution with -1 and undefined

  return (
    <>
      <UserContext.Provider value={{ userId: [userId, setUserId] }}>
        {children}
      </UserContext.Provider>
    </>
  );
};
