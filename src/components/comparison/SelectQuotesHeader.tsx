"use client";

import { IoDocumentTextOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { QuoteType } from "@/src/types/custom/Quote";

import React, { Dispatch, SetStateAction, useState } from "react";
import TabHeader from "../ui/TabHeader";

type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

type SelectQuotesHeaderProps = {
  search: string | undefined;
  setSearch: Dispatch<SetStateAction<string | undefined>>;
  quotes: QuoteTypeWithCheckbox[];
  selectedFilter: any;
  handleSort: any;
  setSelectedFilter: any;
  handleBusiness: any;
  TabHeader: React.ReactNode;
};

export default function SelectQuotesHeader({
  search,
  setSearch,
  quotes,
  selectedFilter,
  handleSort,
  setSelectedFilter,
  handleBusiness,
  TabHeader,
}: SelectQuotesHeaderProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const sortingOptions = [
    { label: "Deductible", value: "deductible" },
    { label: "Coinsurance", value: "coinsurance" },
    { label: "Out of Pocket", value: "out_of_pocket_max" },
    // Add more sorting options as needed
  ];

  const handleSortOptionSelect = (option: string) => {
    if (selectedFilter === option) {
      // If the same filter option is clicked again, clear the selection
      handleSort(null);
      setSelectedFilter(null);
    } else {
      // Otherwise, perform the sort and update the selected filter
      handleSort(option);
      setSelectedFilter(option);
    }
    setShowSortDropdown(false);
  };

  return (
    <div className="w-full flex flex-col mt-4 mb-2 justify-center">
      <div className="flex items-center gap-2">
        {TabHeader}
        {/* <IoDocumentTextOutline className="h-5 w-5" />
        <p className="truncate">{quotes.length} Quotes </p> */}
      </div>
      <div className="w-full flex mt-4 mb-2 justify-between">
        <div className="w-1/2 ml-4 md:ml-0 md:w-1/2 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 transform flex items-center">
            <FaSearch className="h-4 w-4 text-gray-500" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="bg-gray-100/50 w-full px-10 py-1 rounded-sm outline outline-1 outline-gray-300"
          ></input>
        </div>
        <div className="w-1/2 md:w-1/4">
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="px-2 py-1 flex items-center gap-1"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <p>Sort</p>
              <FaChevronDown className="h-3 w-3" />
            </button>
            {showSortDropdown && (
              <div className="absolute mt-36 bg-white border border-gray-200 rounded-sm shadow-lg">
                {sortingOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`px-2 py-1.5 border border-t-0 border-l-0 border-r-0 hover:bg-gray-100 border-gray-400/80 cursor-pointer 
                  ${selectedFilter === option.value ? "bg-gray-100" : ""}
                  ${option.value === "out_of_pocket_max" ? "border-b-0" : ""}  
                    `}
                    onClick={() => handleSortOptionSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
            <button
              className="px-2 py-1 flex items-center gap-1"
              // onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              onClick={() => handleBusiness()}
            >
              <p>Filter</p>
              <FaChevronDown className="h-3 w-3" />
            </button>
            {/* {showFilterDropdown && (
            <div className="absolute mt-36 bg-white border rounded-md shadow-lg">
              {sortingOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-2 py-1.5 border border-b-1 border-gray-300 cursor-pointer hover:border-gray-400 ${
                    selectedFilter === option.value ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleSortOptionSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
