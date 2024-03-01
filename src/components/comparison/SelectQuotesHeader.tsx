"use client";

import { IoDocumentTextOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { QuoteType } from "@/src/types/custom/Quote";

import { Dispatch, SetStateAction, useState } from "react";

type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

type SelectQuotesHeaderProps = {
  search: string | undefined;
  setSearch: Dispatch<SetStateAction<string | undefined>>;
  quotes: QuoteTypeWithCheckbox[];
  selectedFilter: any;
  handleSort: any;
  setSelectedFilter: any;
};

export default function SelectQuotesHeader({
  search,
  setSearch,
  quotes,
  selectedFilter,
  handleSort,
  setSelectedFilter,
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
    <div className="w-full flex mt-4 justify-center">
      <div className="w-1/4 flex items-center gap-2">
        <IoDocumentTextOutline className="h-5 w-5" />
        <p className="truncate">{quotes.length} Quotes </p>
      </div>
      <div className="w-1/3 ml-4 md:ml-0 md:w-1/2 relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
          <FaSearch className="h-4 w-4 text-gray-500" />
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="bg-gray-100/50 w-full px-10 py-1 rounded-sm outline outline-1 outline-gray-300"
        ></input>
      </div>
      <div className="w-5/12 md:w-1/4">
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
          )}
          <button
            className="px-2 py-1 flex items-center gap-1"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <p>Filter</p>
            <FaChevronDown className="h-3 w-3" />
          </button>
          {showFilterDropdown && (
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
          )}
        </div>
      </div>
    </div>
  );
}
