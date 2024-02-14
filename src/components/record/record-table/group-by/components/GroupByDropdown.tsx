export const GroupByDropdown = () => {};

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

  function handleClick() {
    setFilterSetActive(true);
  }

  function handleSubmit() {
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
      setFieldObject({ field: "", value: "", type: "" });
    }
  }

  return (
    <div className="flex flex-col bg-slate-200">
      {filters.length || filterSetActive ? (
        <AppliedFilters filters={filters} filterSetActive={filterSetActive} />
      ) : (
        <>No filters</>
      )}
      <FilterFooter onClick={handleClick} onSubmit={handleSubmit} />
    </div>
  );
};
