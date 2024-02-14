import {
  Metadata,
  Policy,
  emptyPolicy,
  metadata,
} from "@/src/metadata/metadata";
import { Dispatch, SetStateAction, createContext, useState } from "react";

type RecordContextProps = {
  record: [
    Record<string, any>[],
    Dispatch<SetStateAction<Record<string, any>[]>>,
  ];
  recordFields: Policy;
  checked: [number[], Dispatch<SetStateAction<number[]>>];
  userCreatedRecord: [boolean, Dispatch<SetStateAction<boolean>>];
  tableName: {
    singular: string;
    plural: string;
  };
};

export const RecordContext = createContext<RecordContextProps>({
  record: [[], () => {}],
  recordFields: emptyPolicy,
  userCreatedRecord: [false, () => {}],
  checked: [[], () => {}],
  tableName: { singular: "", plural: "" },
});

export function RecordContextProvider({
  children,
  tableName,
}: {
  children: React.ReactNode;
  tableName: {
    singular: string;
    plural: string;
  };
}) {
  const [isUserCreatedRecordActive, setIsUserCreatedRecordActive] =
    useState<boolean>(false);
  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [checkedBoxIds, setCheckedBoxIds] = useState<number[]>([]);
  if (!Object.keys(metadata).includes(tableName.plural.toLowerCase())) {
    throw new Error(`Table not found, ${tableName.plural.toLowerCase()}`);
  }
  const recordFields =
    metadata[tableName.plural.toLowerCase() as keyof Metadata];

  return (
    <>
      <RecordContext.Provider
        value={{
          record: [records, setRecords],
          recordFields,
          userCreatedRecord: [
            isUserCreatedRecordActive,
            setIsUserCreatedRecordActive,
          ],
          checked: [checkedBoxIds, setCheckedBoxIds],
          tableName,
        }}
      >
        {children}
      </RecordContext.Provider>
    </>
  );
}
