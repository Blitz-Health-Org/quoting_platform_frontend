//TODO: Multiple new fields, remove filter button in ui, handleclickoutside
//TODO: autocollapse for various components
//TODO: clear filter

import { AppliedFilters } from "@/src/components/record/record-table/filter/components/AppliedFilters";
import { FilterFooter } from "@/src/components/record/record-table/filter/components/FilterFooter";
import { FilterContext } from "@/src/context/FilterContext";
import { useContext, useState } from "react";

export const FilterDropdown = () => {
  const {
    fieldObject: [fieldObject, setFieldObject],
    filters: [filters, setFilters],
  } = useContext(FilterContext);
  const [filterSetActive, setFilterSetActive] = useState<boolean>(false);
  console.log("filters", filters);

  function handleClick() {
    console.log("did it work click");
    setFilterSetActive(true);
  }

  function handleSubmit() {
    console.log("did it work? submit");
    if (
      filters.findIndex(
        (filter) =>
          filter.field === fieldObject.field &&
          filter.value === fieldObject.value,
      ) === -1
    ) {
      if (fieldObject) {
        const updatedFilters = [
          ...filters,
          { field: fieldObject.field, value: fieldObject.value },
        ];
        setFilters(updatedFilters);
      }
      setFieldObject({ field: "", value: "", type: "" });
    }
    setFilterSetActive(false);
  }

  return (
    <div className="flex flex-col bg-white rounded-md shadow-md border border-1 border-gray-200 p-4 z-50">
      {filters.length || filterSetActive ? (
        <AppliedFilters filters={filters} filterSetActive={filterSetActive} />
      ) : (
        <>No filters</>
      )}
      <FilterFooter onClick={handleClick} onSubmit={handleSubmit} />
    </div>
  );
};
