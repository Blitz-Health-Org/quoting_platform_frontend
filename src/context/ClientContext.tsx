import { SetStateAction, Dispatch, createContext, useState } from "react";
import { ClientType } from "../types/custom/Client";
import { supabase } from "../supabase";

type ClientContextProps = {
  client: ClientType;
  hiddenComparisonFields: [string[], (val: string[]) => void];
  sharingId: string | null;
};

export const ClientContext = createContext<ClientContextProps>({
  client: {} as unknown as ClientType,
  hiddenComparisonFields: [[] as string[], () => {}],
  sharingId: null,
});

export const ClientContextProvider = ({ children, value }: any) => {
  const [hiddenFields, setHiddenFields] = useState<string[]>(
    value.hiddenComparisonFields,
  );

  const updateHiddenFields = async (newHiddenFields: string[]) => {
    await supabase
      .from("clients")
      .update({ hidden_comparison_fields: newHiddenFields })
      .match({
        id: value.client.id,
      });
    setHiddenFields(newHiddenFields);
  };

  return (
    <ClientContext.Provider
      value={{
        hiddenComparisonFields: [hiddenFields, updateHiddenFields],
        client: value.client,
        sharingId: value.sharingId,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
