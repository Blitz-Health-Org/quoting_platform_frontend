"use client";

import RecordTable from "@/src/components/record/record-table/RecordTable";
import { FilterContextProvider } from "@/src/context/commissions/FilterContext";
import { RecordContextProvider } from "@/src/context/commissions/RecordContext";
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
                <div className="w-full rounded-lg bg-white pb-20 pt-6 pl-6 pr-6 border border-1 border-gray-300 h-screen overflow-x-hidden overflow-y-auto">
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
            </div>
          </GroupByContextProvider>
        </FilterContextProvider>
      </RecordContextProvider>
    </>
  );
}
