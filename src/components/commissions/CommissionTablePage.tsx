"use client";

import RecordTableContainer from "@/src/components/record/record-table/RecordTableContainer";
import { RecordHeader } from "@/src/components/record/record-table/group-by/components/GroupByShortcutHeader";
import { GroupByContextProvider } from "@/src/context/commissions/GroupByContext";
import { RecordContextProvider } from "@/src/context/commissions/RecordContext";

export const CommissionTablePage = () => {
  const tableName = {
    singular: "Policy",
    plural: "Policies",
  };

  return (
    <div className="w-full h-full rounded-t-lg">
      <RecordContextProvider
        tableName={{ singular: tableName.singular, plural: tableName.plural }}
      >
        <GroupByContextProvider>
          <RecordHeader tableName={tableName} />
          <div className="flex">
            <RecordTableContainer />
          </div>
        </GroupByContextProvider>
      </RecordContextProvider>
    </div>
  );
};
