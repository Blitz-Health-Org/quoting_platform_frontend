import { PolicyField } from "../../types/metadata";
import { Dispatch, SetStateAction, createContext, useState } from "react";

type GroupContextProps = {
  groupField: [Partial<PolicyField>, Dispatch<SetStateAction<any>>];
};

export const GroupByContext = createContext<GroupContextProps>({
  groupField: [{}, () => ""],
});

export function GroupByContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [groupFieldObject, setGroupFieldObject] = useState<
    Partial<PolicyField>
  >({});

  return (
    <>
      <GroupByContext.Provider
        value={{ groupField: [groupFieldObject, setGroupFieldObject] }}
      >
        {children}
      </GroupByContext.Provider>
    </>
  );
}
