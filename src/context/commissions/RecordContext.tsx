import { PolicyField, metadata } from "@/src/types/metadata";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

type RecordContextProps = {
  visibleFieldDefinitionObjects: [
    PolicyField[],
    Dispatch<SetStateAction<PolicyField[]>>,
  ];
  record: [
    Record<string, any>[] | null,
    Dispatch<SetStateAction<Record<string, any>[] | null>>,
  ];
  filteredRecords: [
    Record<string, any>[],
    Dispatch<SetStateAction<Record<string, any>[]>>,
  ];
  groupedFilteredRecords: [
    Record<string, any>,
    Dispatch<SetStateAction<Record<string, any>>>,
  ];
  checked: [number[], Dispatch<SetStateAction<number[]>>];
  userCreatedRecord: [boolean, Dispatch<SetStateAction<boolean>>];
  tableName: {
    singular: string;
    plural: string;
  };
  expanded: [boolean, Dispatch<SetStateAction<boolean>>];
};

export const RecordContext = createContext<RecordContextProps>({
  visibleFieldDefinitionObjects: [[], () => {}],
  record: [null, () => {}],
  filteredRecords: [[], () => {}],
  groupedFilteredRecords: [[], () => {}],
  userCreatedRecord: [false, () => {}],
  checked: [[], () => {}],
  tableName: { singular: "", plural: "" },
  expanded: [false, () => {}],
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
  const [records, setRecords] = useState<Record<string, any>[] | null>(null);
  const [filteredRecords, setFilteredRecords] = useState<Record<string, any>[]>(
    [],
  );
  const [groupedFilteredRecords, setGroupedFilteredRecords] = useState<
    Record<string, any>
  >([]);
  const [checkedBoxIds, setCheckedBoxIds] = useState<number[]>([]);
  const [visibleFieldDefinitionObjects, setvisibleFieldDefinitionObjects] =
    useState<PolicyField[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!Object.keys(metadata).includes(tableName.plural.toLowerCase())) {
    throw new Error(`Table not found, ${tableName.plural.toLowerCase()}`);
  }
  return (
    <>
      <RecordContext.Provider
        value={{
          record: [records, setRecords],
          filteredRecords: [filteredRecords, setFilteredRecords],
          groupedFilteredRecords: [
            groupedFilteredRecords,
            setGroupedFilteredRecords,
          ],
          userCreatedRecord: [
            isUserCreatedRecordActive,
            setIsUserCreatedRecordActive,
          ],
          checked: [checkedBoxIds, setCheckedBoxIds],
          tableName,
          visibleFieldDefinitionObjects: [
            visibleFieldDefinitionObjects,
            setvisibleFieldDefinitionObjects,
          ],
          expanded: [isExpanded, setIsExpanded],
        }}
      >
        {children}
      </RecordContext.Provider>
    </>
  );
}
