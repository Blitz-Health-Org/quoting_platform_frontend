"use client";

//TODO: Loading screen, disentangle buttons with loading chart
//TODO: Tablename, display at top

import React, { useContext } from "react";
// import { FaTrash } from 'react-icons/fa';
import { RecordTableHeader } from "@/src/components/record/record-table/RecordTableHeader";
import { RecordTableBody } from "@/src/components/record/record-table/RecordTableBody";
import { RecordViewHeader } from "@/src/components/record/record-table/view/RecordViewHeader";
import { useRecordTable } from "@/src/components/record/record-table/hooks/useRecordTable";
import { FilterContext } from "@/src/context/FilterContext";
import { GroupByContext } from "@/src/context/GroupByContext";
import { RecordContext } from "@/src/context/RecordContext";
import { Graphs } from "@/src/components/record/record-table/graph/Graphs";
import { MdAutoGraph } from "react-icons/md";

export type RecordTableProps = {
  dateTableBody: React.ReactNode;
};

export default function RecordTable({ dateTableBody }: RecordTableProps) {
  // const handleNewButtonClick = () => {
  //   const policy: Row = {};
  //   setPolicies([...policies, policy] as any);
  // };

  const {
    filters: [filters],
  } = useContext(FilterContext); // Destructure filters from context
  const {
    groupField: [groupFieldObject],
  } = useContext(GroupByContext);
  const {
    record,
    userCreatedRecord: [
      isUserCreatedRecordActive,
      setIsUserCreatedRecordActive,
    ],
    checked,
    tableName,
  } = useContext(RecordContext);

  let {
    filteredRecords,
    visibleFieldDefinitionObjects,
    groupedFilteredRecords,
  } = useRecordTable(tableName, filters, groupFieldObject, record);

  return (
    <div className="rounded-lg bg-white pb-20 pt-6 pl-6 pr-6 border border-1 border-gray-300 h-screen overflow-x-hidden overflow-y-auto">
      <div className="w-full flex-col">
        <div className="text-sm mb-5 flex items-center">
          <MdAutoGraph className="mr-1 h-5 w-5" />
          <p>Graphs (3)</p>
        </div>
        <Graphs
          groupedFilteredRecords={groupedFilteredRecords}
          groupFieldObject={groupFieldObject}
          filteredRecords={filteredRecords}
          visibleFieldDefinitionObjects={visibleFieldDefinitionObjects as any}
        />
      </div>
      <div className="border-t border-gray-200 w-full my-4"></div>

      <div className="mt-4 flex flex-col w-full bg-white h-fit">
        <RecordViewHeader />
        <div className="flex">
          <div className="flex flex-col overflow-x-scroll">
            <RecordTableHeader />
            <RecordTableBody
              userCreatedRecord={[
                isUserCreatedRecordActive,
                setIsUserCreatedRecordActive,
              ]}
              record={record}
              filteredRecords={filteredRecords}
              visibleFieldDefinitionObjects={visibleFieldDefinitionObjects}
              groupedFilteredRecords={groupedFilteredRecords}
              groupFieldObject={groupFieldObject}
              checked={checked}
            />
          </div>
          {dateTableBody}
        </div>
      </div>
    </div>
  );
}
