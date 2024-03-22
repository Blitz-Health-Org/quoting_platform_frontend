"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";
import { handleUpdateQuotes } from "../components/comparison/utils/updateQuotes";
import { ClientType } from "../types/custom/Client";

type PlanGroupContextProps = {
  isEditing: boolean;
  editedQuotes: any;
  setEditedQuotes: (quotes: any) => void;
};

export const PlanGroupContext = createContext<PlanGroupContextProps>({
  isEditing: false,
  editedQuotes: [],
  setEditedQuotes: (quotes: any) => {},
});

type EditQuoteContextProviderProps = {
  children: React.ReactNode;
  value: {
    isEditing: boolean;
    quotes: any;
    clientId: number;
    planId: number;
    fetchClientAndQuotes: any;
  };
};
export const PlanGroupContextProvider = ({
  children,
  value,
}: EditQuoteContextProviderProps) => {
  const [editedQuotes, setEditedQuotes] = useState(value.quotes);
  const { isEditing } = value;
  const [prevIsEditing, setPrevIsEditing] = useState<boolean>(isEditing);

  console.log("edit", prevIsEditing, isEditing, editedQuotes);
  if (prevIsEditing !== isEditing) {
    setPrevIsEditing(isEditing);
    if (prevIsEditing !== undefined) {
      console.log("WOEIFJWOIEJF");
      handleUpdateQuotes(
        editedQuotes,
        value.clientId,
        value.planId,
        value.fetchClientAndQuotes,
      );
    }
  }

  return (
    <PlanGroupContext.Provider
      value={{
        editedQuotes,
        setEditedQuotes,
        ...value,
      }}
    >
      {children}
    </PlanGroupContext.Provider>
  );
};
