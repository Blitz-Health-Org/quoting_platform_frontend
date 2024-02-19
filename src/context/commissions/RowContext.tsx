import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { Row } from "@/src/types/custom/Row";
import { formatISO } from "date-fns";

const now = new Date();
const formattedNow = formatISO(now);

type RowContextProps = {
  row: any;
  isUserCreatedRow: boolean;
};

export const RowContext = createContext<RowContextProps>({
  row: null,
  isUserCreatedRow: false,
});

export function RowContextProvider({
  children,
  isUserCreatedRow = false,
  initialRow = { created_at: formattedNow },
}: {
  children: React.ReactNode;
  isUserCreatedRow?: boolean;
  initialRow?: Row;
}) {
  const row = initialRow;

  return (
    <>
      <RowContext.Provider value={{ row, isUserCreatedRow }}>
        {children}
      </RowContext.Provider>
    </>
  );
}
