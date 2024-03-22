"use client";

import { IoDocumentTextOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { QuoteType } from "@/src/types/custom/Quote";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  valueDeductible: any;
  setValueDeductible: any;
  valueEmployeeRate: any;
  setValueEmployeeRate: any;
  valueOOP: any;
  setValueOOP: any;
  findMinimumValue: any;
  findMaximumValue: any;
  currentTab: any;
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
  valueDeductible,
  setValueDeductible,
  valueEmployeeRate,
  setValueEmployeeRate,
  valueOOP,
  setValueOOP,
  findMinimumValue,
  findMaximumValue,
  currentTab,
}: SelectQuotesHeaderProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const sortingOptions = [
    { label: "Deductible", value: "deductible" },
    { label: "Coinsurance", value: "coinsurance" },
    { label: "Employee Only Rate", value: "employee_rate" },
    { label: "Out of Pocket", value: "out_of_pocket_max" },
    // Add more sorting options as needed
  ];

  const filterOptions = [
    { label: "Deductible", value: "deductible" },
    // { label: "Coinsurance", value: "coinsurance" },
    { label: "Employee Only Rate", value: "employee_rate" },
    { label: "Out of Pocket", value: "out_of_pocket_max" },
    // Add more sorting options as needed
  ];

  // const minimumCoinsurance = findMinimumValue("coinsurance")
  // const maximumCoinsurance = findMaximumValue("coinsurance")
  const minimumOOP = findMinimumValue("out_of_pocket_max");
  const maximumOOP = findMaximumValue("out_of_pocket_max");

  function chooseMinimumValue(category: string) {
    return findMinimumValue(category);
  }
  // else if (category === "coinsurance") {
  //   return minimumCoinsurance;
  // }

  function chooseMaximumValue(category: string) {
    return findMaximumValue(category);
  }

  const marks = {
    deductible: [
      {
        value: findMinimumValue("deductible"),
        label: `$${findMinimumValue("deductible")}`,
      },
      {
        value: findMaximumValue("deductible"),
        label: `$${findMaximumValue("deductible")}`,
      },
    ],
    employee_rate: [
      {
        value: findMinimumValue("employee_rate"),
        label: `$${findMinimumValue("employee_rate")}`,
      },
    ],
    // coinsurance: [{value: minimumCoinsurance, label: `$${minimumCoinsurance}`}, {value: maximumCoinsurance, label: `$${maximumCoinsurance}`}],
    out_of_pocket_max: [
      { value: minimumOOP, label: `$${minimumOOP}` },
      { value: maximumOOP, label: `$${maximumOOP}` },
    ],
  };

  const handleChange = (
    category: string,
    event: Event,
    newValue: number | number[],
  ) => {
    if (category === "deductible") {
      setValueDeductible(newValue as number[]);
    }
    // else if (category === "coinsurance") {
    //   setValueCoinsurance(newValue as number[]);
    // }
    else if (category === "out_of_pocket_max") {
      setValueOOP(newValue as number[]);
    } else if (category === "employee_rate") {
      setValueEmployeeRate(newValue as number[]);
    }
  };

  function chooseValue(category: string) {
    if (category === "deductible") {
      return valueDeductible;
    }
    // else if (category === "coinsurance") {
    //   return valueCoinsurance;
    // }
    else if (category === "out_of_pocket_max") {
      return valueOOP;
    } else if (category === "employee_rate") {
      return valueEmployeeRate;
    }
  }

  function valuetext(value: number) {
    return `$${value}`;
  }

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

  function toggleDropdown(options: "sort" | "filter") {
    if (options === "sort") {
      if (showFilterDropdown) {
        setShowFilterDropdown(false);
      }
      setShowSortDropdown(!showSortDropdown);
    }
    if (options === "filter") {
      if (showSortDropdown) {
        setShowSortDropdown(false);
      }
      setShowFilterDropdown(!showFilterDropdown);
    }
  }

  const shouldDisplayOption = (option: any) => {
    console.log("OPTION", option);
    const minValue = chooseMinimumValue(option.value);
    const maxValue = chooseMaximumValue(option.value);
    console.log(option, "should or should not display", minValue, maxValue);
    return minValue !== maxValue;
  };

  return (
    <div className="w-full flex flex-col mt-4 mb-2 justify-center">
      <div className="flex items-center gap-2">
        {TabHeader}
        {/* <IoDocumentTextOutline className="h-5 w-5" />
        <p className="truncate">{quotes.length} Quotes </p> */}
      </div>
      <div className="w-full flex flex-col md:flex-row mt-4 mb-2 justify-between">
        <div className="w-full ml-1 md:w-1/2 relative">
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
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-center md:justify-end md:mt-0 mt-4">
            <div className="flex flex-col">
              <button
                className="cursor-pointer px-2 py-1 flex items-center gap-1"
                onClick={() => toggleDropdown("filter")}
              >
                <p>Filter</p>
                <FaChevronDown className="h-3 w-3" />
              </button>
              {showFilterDropdown && (
                <div className="ml-1 absolute mt-8 z-50 bg-white border rounded-md shadow-lg">
                  {filterOptions.map(
                    (option) =>
                      shouldDisplayOption(option) && (
                        <div
                          key={option.value}
                          className={`px-2 py-1.5 border border-t-0 border-l-0 border-r-0 hover:bg-gray-100 border-gray-400/80 cursor-pointer 
                      ${selectedFilter === option.value ? "bg-gray-100" : ""}
                      ${option.value === "out_of_pocket_max" ? "border-b-0" : ""}`}
                        >
                          <div className="flex flex-col gap-2 px-6 py-1.5">
                            {option.label}
                            <Box sx={{ width: 200 }}>
                              <Slider
                                key={currentTab}
                                defaultValue={[
                                  chooseMinimumValue(
                                    option.value as
                                      | "deductible"
                                      | "coinsurance"
                                      | "out_of_pocket_max",
                                  ),
                                  chooseMaximumValue(
                                    option.value as
                                      | "deductible"
                                      | "coinsurance"
                                      | "out_of_pocket_max",
                                  ),
                                ]}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    option.value as string,
                                    event,
                                    newValue,
                                  )
                                }
                                valueLabelDisplay="auto"
                                getAriaValueText={valuetext}
                                min={chooseMinimumValue(
                                  option.value as
                                    | "deductible"
                                    | "coinsurance"
                                    | "out_of_pocket_max",
                                )}
                                max={chooseMaximumValue(
                                  option.value as
                                    | "deductible"
                                    | "coinsurance"
                                    | "out_of_pocket_max",
                                )}
                                marks={
                                  marks[
                                    option.value as
                                      | "deductible"
                                      | "out_of_pocket_max"
                                  ]
                                }
                              />
                            </Box>
                          </div>
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <button
                className="cursor-pointer px-2 py-1 flex items-center gap-1"
                // onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                onClick={() => toggleDropdown("sort")}
              >
                <p>Sort by</p>
                <FaChevronDown className="h-3 w-3" />
              </button>
              {showSortDropdown && (
                <div className="ml-1 absolute mt-8 z-50 bg-white border rounded-md shadow-lg">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
