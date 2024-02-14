// @ts-nocheck
type AggregationRowCellProps = {
  entry: [string, any];
  records: any;
};

export const AggregationRowCell = ({
  entry,
  records,
}: AggregationRowCellProps) => {
  const [field, value] = entry;

  let aggregatedValue;

  if (value.type === "number") {
    aggregatedValue = records.reduce(
      (acc: any, record: any) => acc + (record[field] || 0),
      0,
    );
  }

  return (
    <textarea
      className="truncate resize-none cursor-pointer focus:cursor-auto h-7 text-sm outline outline-1 outline-gray-200 hover:z-20 hover:outline-gray-300 hover:z-9 py-1 pl-2 z-0 focus:ring-2 focus:z-10 focus:outline-gray-200 w-full"
      defaultValue={aggregatedValue}
      readOnly
    />
  );
};
