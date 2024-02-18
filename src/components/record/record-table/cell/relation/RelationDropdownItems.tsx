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
    <>
      {items.map((item, index) => {
        return (
          <div
            key={index}
            onClick={handleClick(item)}
            className="
          cursor-pointer border border-black"
          >
            {item[labelField]}
          </div>
        );
      })}
    </>
  );
};
