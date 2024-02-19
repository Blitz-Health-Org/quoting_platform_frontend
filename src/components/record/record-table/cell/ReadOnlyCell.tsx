type ReadOnlyCellProps = {
  setRefs: any;
  isUserCreatedRow: boolean;
  isFirstField: boolean;
  defaultValue: string;
};

export const ReadOnlyCell = ({
  setRefs,
  isUserCreatedRow,
  isFirstField,
  defaultValue,
}: ReadOnlyCellProps) => {
  return (
    <textarea
      readOnly
      onClick={() => alert("Cell is read only (calculated)")}
      ref={setRefs}
      autoFocus={isUserCreatedRow && isFirstField}
      className="block border-l-0 whitespace-nowrap border-t-0 hover:border-l bg-transparent hover:border-t focus:border-t focus:border-l focus:z-10 resize-none cursor-pointer focus:outline-0 focus:border-gray-400 hover:border-gray-400/80 focus:cursor-auto h-7 text-sm border border-1 border-gray-200 w-full py-0.5 px-1 z-0 hover:rounded-md focus:rounded-md"
      defaultValue={defaultValue}
    />
  );
};
