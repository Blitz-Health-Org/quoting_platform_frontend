import { createContext } from "react";

type ColumnContext = {
  field: string;
};

export const ColumnContext = createContext<ColumnContext | null>(null);
