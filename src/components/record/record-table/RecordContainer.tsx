"use client";

import RecordTable from "@/src/components/record/record-table/RecordTable";
import { FilterContextProvider } from "@/src/context/commissions/FilterContext";
import { isFieldVisible } from "@/src/types/utils/isFieldVisible";
import { getRecordFields } from "./utils/getRecordFields";
import {
  RecordContext,
  RecordContextProvider,
} from "@/src/context/commissions/RecordContext";
import { useContext, useState } from "react";
import { RecordHeader } from "./group-by/components/GroupByShortcutHeader";
import { GroupByContextProvider } from "@/src/context/commissions/GroupByContext";
import RecordOverview from "./RecordOverview";
import TabHeader from "./TabHeader";

export type RecordTableContainerProps = {
  dateTableBody?: React.ReactNode;
  tableName: {
    singular: string;
    plural: string;
  };
};

const TABS = ["Table", "Overview"];

export default function RecordTableContainer({
  dateTableBody,
  tableName,
}: RecordTableContainerProps) {
  const [tab, setTab] = useState<string>("Table");

  return (
    <>
      <RecordContextProvider
        tableName={{ singular: tableName.singular, plural: tableName.plural }}
      >
        <FilterContextProvider>
          <GroupByContextProvider>
            <div className="w-full h-full rounded-t-lg">
              <RecordHeader tableName={tableName} />
              <div className="flex flex-col mt-3">
                <TabHeader
                  selectedTab={tab}
                  tabs={TABS}
                  setSelectedTab={setTab}
                />
                {tab === "Table" ? (
                  <RecordTable
                    tableName={tableName}
                    dateTableBody={dateTableBody}
                    // setTab={setTab}
                  />
                ) : tab === "Overview" ? (
                  <RecordOverview tableName={tableName} setTab={setTab} />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </GroupByContextProvider>
        </FilterContextProvider>
      </RecordContextProvider>
    </>
  );
}
