"use client";

import { createContext } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";

export type UserContextProps = {
  userId: [number | undefined, (value: number | undefined) => void, boolean];
};

export const UserContext = createContext<UserContextProps>({
  userId: [undefined, () => {}, true],
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userId, setUserId, loading] = useLocalStorage<number | undefined>(
    "blume_user_id",
    undefined,
  );

  return (
    <>
      <UserContext.Provider value={{ userId: [userId, setUserId, loading] }}>
        {children}
      </UserContext.Provider>
    </>
  );
};
