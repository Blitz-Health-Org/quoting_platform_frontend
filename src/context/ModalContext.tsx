"use client";

import { createContext, useEffect } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";
import { supabase } from "../supabase";
import { useState } from "react";

export type ModalContextProps = {
  modalOpen: [string | undefined, (value: string | undefined) => void, boolean];
};

export const ModalContext = createContext<ModalContextProps>({
  modalOpen: [undefined, () => {}, true],
});

export const ModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modalOpen, setModalOpen, loading] = useLocalStorage<
    string | undefined
  >("modalOpen", undefined);

  return (
    <>
      <ModalContext.Provider
        value={{
          modalOpen: [modalOpen, setModalOpen, loading],
        }}
      >
        {children}
      </ModalContext.Provider>
    </>
  );
};
