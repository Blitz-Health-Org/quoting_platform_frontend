type TableGroupHeaderProps = {
  group: string;
};

export const TableGroupHeader = ({ group }: TableGroupHeaderProps) => {
  return (
    <div className="text-center w-full border border-l-0 border-t-0 font-semibold border-r-0 border-gray-300/80">
      {group}
    </div>
  );
};
