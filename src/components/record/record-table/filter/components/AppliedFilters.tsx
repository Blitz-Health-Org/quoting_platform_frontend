import { SetFilter } from "@/src/components/record/record-table/filter/components/SetFilter";
import { Filter } from "@/src/types/custom/Filter";

type AppliedFiltersProps = {
  filters: Filter[];
  filterSetActive: boolean;
};

export const AppliedFilters = ({
  filters,
  filterSetActive,
}: AppliedFiltersProps) => {
  return (
    <div className="flex">
      {filterSetActive ? (
        <SetFilter />
      ) : (
        <div className="flex flex-col">
          {filters.map((filter, index) => {
            return (
              <div key={index}>
                {filter.field} = {filter.value}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
