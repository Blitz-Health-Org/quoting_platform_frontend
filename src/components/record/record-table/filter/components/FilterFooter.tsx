type FilterFooterProps = {
  onClick: () => void;
  onSubmit: () => void;
  onReset: () => void;
  filterSetActive: boolean;
};

export const FilterFooter = ({
  filterSetActive,
  onClick,
  onSubmit,
  onReset,
}: FilterFooterProps) => {
  return (
    <>
      <div className="flex flex-col">
        <hr className="mb-2 mt-2"></hr>
        <div className="flex">
          <button
            className="px-2 py-1 mr-1 text-sm rounded-sm outline outline-1 outline-gray-300 shadow-sm cursor-pointer"
            onClick={onReset}
          >
            ↻ Reset Filters
          </button>
          {filterSetActive && (
            <button
              className="px-2 py-1 ml-1 text-sm rounded-sm outline outline-1 outline-gray-300 shadow-sm cursor-pointer"
              onClick={onSubmit}
            >
              ✓ Apply Filter
            </button>
          )}
        </div>
        {!filterSetActive && (
          <button
            className="mt-2 px-2 py-1 text-sm rounded-sm outline outline-1 outline-gray-300 shadow-sm cursor-pointer"
            onClick={onClick}
          >
            + New Filter
          </button>
        )}
      </div>
    </>
  );
};
