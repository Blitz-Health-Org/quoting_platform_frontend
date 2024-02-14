"use client";

import RecordTable from "@/src/components/record/record-table/RecordTable";
import { FilterContextProvider } from "@/src/context/FilterContext";

export type RecordTableContainerProps = {
  dateTableBody?: React.ReactNode;
};

export default function RecordTableContainer({
  dateTableBody,
}: RecordTableContainerProps) {
  return (
    <FilterContextProvider>
      <RecordTable dateTableBody={dateTableBody} />
      {/* 
        <div className="flex flex-row w-full">
            Suppp
            <textarea className="cursor-pointer focus:cursor-auto resize-x h-7 text-sm outline outline-1 outline-gray-200 hover:outline-gray-300 hover:z-9 py-1 px-2 z-2 focus:ring-2 focus:z-10 focus:outline-gray-200"></textarea>
            <textarea className="resize-x h-7 text-sm outline outline-1 outline-gray-200 hover:outline-gray-300 hover:z-9 py-1 px-2 z-2 focus:ring-2 focus:z-10 focus:outline-gray-200"></textarea>
            <textarea className="resize-x h-7 text-sm outline outline-1 outline-gray-200 hover:outline-gray-300 hover:z-9 py-1 px-2 z-2 focus:ring-2 focus:z-10 focus:outline-gray-200"></textarea>
        </div> */}
    </FilterContextProvider>
  );
}
