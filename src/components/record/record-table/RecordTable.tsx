"use client";

//TODO: Loading screen, disentangle buttons with loading chart
//TODO: Tablename, display at top

import React, { useContext } from "react";
// import { FaTrash } from 'react-icons/fa';
import { RecordTableHeader } from "@/src/components/record/record-table/RecordTableHeader";
import { RecordTableBody } from "@/src/components/record/record-table/RecordTableBody";
import { RecordViewHeader } from "@/src/components/record/record-table/view/RecordViewHeader";
import { useRecordTable } from "@/src/components/record/record-table/hooks/useRecordTable";
import { FilterContext } from "@/src/context/commissions/FilterContext";
import { GroupByContext } from "@/src/context/commissions/GroupByContext";
import { RecordContext } from "@/src/context/commissions/RecordContext";
import { Graphs } from "@/src/components/record/record-table/graph/Graphs";
import { MdAutoGraph } from "react-icons/md";
import ExpandCollapseButton from "./ExpandCollapseButton";
import { collapsedVisibleFields } from "./constants/collapsedVisibleFields";

export type RecordTableProps = {
  dateTableBody: React.ReactNode;
  tableName: {
    singular: string;
    plural: string;
  };
};

export default function RecordTable({
  dateTableBody,
  tableName,
}: RecordTableProps) {
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

  const { loading } = useRecordTable(tableName, filters, groupFieldObject);

  const {
    record,
    filteredRecords: [filteredRecords],
    groupedFilteredRecords: [groupedFilteredRecords],
    userCreatedRecord: [
      isUserCreatedRecordActive,
      setIsUserCreatedRecordActive,
    ],
    checked,
    visibleFieldDefinitionObjects: [visibleFieldDefinitionObjects],
    expanded: [isExpanded],
  } = useContext(RecordContext);

  if (loading) {
    return <></>;
  }

  return (
    <>
      <div className="w-full flex-col">
        {/* <div className="text-sm mb-5 flex items-center">
          <MdAutoGraph className="mr-1 h-5 w-5" />
          <p>Graphs (3)</p>
        </div> */}
        <Graphs
          groupedFilteredRecords={groupedFilteredRecords}
          groupFieldObject={groupFieldObject}
          filteredRecords={filteredRecords}
          visibleFieldDefinitionObjects={visibleFieldDefinitionObjects as any}
        />
      </div>
      <div className="border-t border-gray-200 w-full my-4"></div>

      <div className="mt-4 flex flex-col w-full bg-white h-fit overflow-y-scroll">
        <RecordViewHeader />
        <div className="flex h-fit">
          <div className="flex flex-col overflow-scroll w-full border border-gray-200">
            <RecordTableHeader />
            <RecordTableBody
              userCreatedRecord={[
                isUserCreatedRecordActive,
                setIsUserCreatedRecordActive,
              ]}
              record={record as any}
              filteredRecords={filteredRecords}
              visibleFieldDefinitionObjects={visibleFieldDefinitionObjects}
              groupedFilteredRecords={groupedFilteredRecords}
              groupFieldObject={groupFieldObject}
              checked={checked}
            />
          </div>
          <ExpandCollapseButton />
          {dateTableBody}
        </div>
      </div>
    </>
  );
}
