export const RelationDropdownItems = ({
  items,
  handleClick,
  labelField,
}: {
  items: any[];
  handleClick: any;
  labelField: string;
}) => {
  return (
    <div className="border p-1 border-gray-400 bg-white h-fit shadow">
      {items.map((item, index) => {
        return (
          <div
            key={index}
            onClick={handleClick(item)}
            className="
          cursor-pointer border-b border-gray-400 text-sm"
          >
            {item[labelField]}
          </div>
        );
      })}
    </div>
  );
};
