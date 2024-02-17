"use client";

import RecordTable from "@/src/components/record/record-table/RecordTable";
import { FilterContextProvider } from "@/src/context/commissions/FilterContext";
import { isFieldVisible } from "@/src/types/utils/isFieldVisible";
import { getRecordFields } from "./utils/getRecordFields";
import {
  RecordContext,
  RecordContextProvider,
} from "@/src/context/commissions/RecordContext";
import { useContext } from "react";
import { RecordHeader } from "./group-by/components/GroupByShortcutHeader";
import { GroupByContextProvider } from "@/src/context/commissions/GroupByContext";

export type RecordTableContainerProps = {
  dateTableBody?: React.ReactNode;
  tableName: {
    singular: string;
    plural: string;
  };
};

export default function RecordTableContainer({
  dateTableBody,
  tableName,
}: RecordTableContainerProps) {
  return (
    <>
      <RecordContextProvider
        tableName={{ singular: tableName.singular, plural: tableName.plural }}
      >
        <FilterContextProvider>
          <GroupByContextProvider>
            <div className="w-full h-full rounded-t-lg">
              <RecordHeader tableName={tableName} />
              <div className="flex">
                <RecordTable
                  tableName={tableName}
                  dateTableBody={dateTableBody}
                />
              </div>
            </div>
          </GroupByContextProvider>
        </FilterContextProvider>
      </RecordContextProvider>
    </>
  );
}
