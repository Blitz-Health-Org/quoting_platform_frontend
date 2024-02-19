//TODO: Multiple new fields, remove filter button in ui, handleclickoutside
//TODO: autocollapse for various components
//TODO: clear filter

import { AppliedFilters } from "@/src/components/record/record-table/filter/components/AppliedFilters";
import { FilterFooter } from "@/src/components/record/record-table/filter/components/FilterFooter";
import { FilterContext } from "@/src/context/commissions/FilterContext";
import { Dispatch, SetStateAction, useContext, useState } from "react";

export const FilterDropdown = ({
  controlledDropdownOpen,
}: {
  controlledDropdownOpen: [boolean, Dispatch<SetStateAction<boolean>>];
}) => {
  const {
    fieldObject: [fieldObject, setFieldObject],
    filters: [filters, setFilters],
  } = useContext(FilterContext);
  const [filterSetActive, setFilterSetActive] = useState<boolean>(false);
  const [, setIsFilterDropdownOpen] = controlledDropdownOpen;

  function handleClick() {
    setFilterSetActive(true);
  }

  function handleReset() {
    setFilters([]);
    setFilterSetActive(false);
    setIsFilterDropdownOpen(false);
    setFieldObject({ field: "", value: "", type: "" });
  }

  function handleSubmit() {
    if (fieldObject) {
      if (
        filters.findIndex(
          (filter) =>
            filter.field === fieldObject.field &&
            filter.value === fieldObject.value,
        ) === -1
      ) {
        const updatedFilters = [
          ...filters,
          { field: fieldObject.field, value: fieldObject.value },
        ];
        setFilters(updatedFilters);
        setFilterSetActive(false);
        setIsFilterDropdownOpen(false);
        setFieldObject({ field: "", value: "", type: "" });
      }
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-md shadow-md border border-1 border-gray-200 p-4 z-50">
      {filters.length || filterSetActive ? (
        <AppliedFilters filters={filters} filterSetActive={filterSetActive} />
      ) : (
        <>No filters</>
      )}
      <FilterFooter
        filterSetActive={filterSetActive}
        onClick={handleClick}
        onReset={handleReset}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
