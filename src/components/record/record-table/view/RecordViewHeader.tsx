import { FilterDropdown } from "@/src/components/record/record-table/filter/components/FilterDropdown";
import { ViewHeaderButtons } from "@/src/components/record/record-table/view/ViewHeaderButtons";
import { Dropdown } from "@/src/components/ui/dropdown/Dropdown";
import { useRecordTable } from "@/src/components/record/record-table/hooks/useRecordTable";
import { CiBoxList } from "react-icons/ci";
import { useContext, useState } from "react";
import { RecordContext } from "@/src/context/commissions/RecordContext";
import { FilterContext } from "@/src/context/commissions/FilterContext";
import { Filter } from "@/src/types/custom/Filter";
import { filter } from "lodash";

export const RecordViewHeader = () => {
  const {
    filteredRecords: [filteredRecords],
  } = useContext(RecordContext);

  const {
    filters: [filters, setFilters],
  } = useContext(FilterContext);

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] =
    useState<boolean>(false);

  function handleDeleteFilter(filter: Filter) {
    return () => {
      setFilters(
        filters.filter(
          (iteratedFilter) =>
            !(
              iteratedFilter.field === filter.field &&
              iteratedFilter.value === filter.value
            ),
        ),
      );
    };
  }

  // const [isHorizontalScroll, setIsHorizontalScroll] = useState<boolean>(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollElement = document.getElementById("scrollContainer");
  //     if (scrollElement) {
  //       console.log('yo')
  //       const isScrolling = scrollElement.scrollWidth > scrollElement.clientWidth;
  //       setIsHorizontalScroll(isScrolling);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 w-full mb-4">
        <div className="col-span-1 h-full">
          <div className="text-center flex items-center justify-left text-sm h-full">
            <CiBoxList className="w-5 h-5" />
            <p className="ml-1.5 mr-1.5"> Records</p>
            <p>({filteredRecords.length})</p>
          </div>
        </div>

        <div className={`col-span-1 flex flex-row justify-end items-center`}>
          <button className="mx-1 px-1 py-1 text-sm rounded-sm bg-white cursor-pointer text-center">Expand</button>
          <Dropdown
            controlledDropdownOpen={[
              isFilterDropdownOpen,
              setIsFilterDropdownOpen,
            ]}
            collapseOnClick={false}
            clickableComponent={
              <button className="mx-1 px-1 py-1 text-sm rounded-sm bg-white cursor-pointer text-center">
                Filter
              </button>
            }
            dropdownComponents={
              <FilterDropdown
                controlledDropdownOpen={[
                  isFilterDropdownOpen,
                  setIsFilterDropdownOpen,
                ]}
              />
            }
          />

          {/* <Dropdown clickableComponent = {<button className="mx-1 px-2 py-1 text-sm rounded-sm outline outline-1 outline-gray-300 shadow-sm bg-white cursor-pointer text-center">Sort By</button>} dropdownComponents={<div>stuff</div>}/> */}
          {/* <Dropdown
            collapseOnClick
            clickableComponent={
              <button className="mx-1 px-1 py-1 text-sm rounded-sm bg-white cursor-pointer text-center">
                Group By
              </button>
            }
            dropdownComponents={<ViewHeaderButtons />}
          />

          <Dropdown
            clickableComponent={
              <button className="mx-1 px-1 py-1 text-sm rounded-sm bg-white cursor-pointer text-center">
                Sort
              </button>
            }
            dropdownComponents={<ViewHeaderButtons />}
          /> */}
        </div>
      </div>
      <div className="mb-2">
        {filters.map((filter, index) => {
          return (
            <span className=" p-1 bg-slate-200 text-xs rounded-md" key={index}>
              <span className="mr-2">
                {filter.field} = {filter.value}
              </span>
              <button
                onClick={handleDeleteFilter(filter)}
                className="hover:text-red-600"
              >
                X
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
};
