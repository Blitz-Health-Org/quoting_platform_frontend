"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";

export type UserContextProps = {
  userId: [number | undefined, Dispatch<SetStateAction<number | undefined>>];
};

export const UserContext = createContext<UserContextProps>({
  userId: [undefined, () => {}],
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userId, setUserId] = useState<number | undefined>(1); //TODO: implement so it's not hard coded
  return (
    <>
      <UserContext.Provider value={{ userId: [userId, setUserId] }}>
        {children}
      </UserContext.Provider>
    </>
  );
};
