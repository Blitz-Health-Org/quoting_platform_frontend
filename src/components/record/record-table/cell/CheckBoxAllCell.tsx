import { RecordContext } from "@/src/context/RecordContext";
import { useContext, useState } from "react";

export const CheckboxAllCell = () => {
  const [checked, setChecked] = useState<boolean>(false);
  const {
    record: [records],
    checked: [checkedBoxIds, setCheckBoxIds],
  } = useContext(RecordContext);

  const allChecked = records.length === checkedBoxIds.length;

  function handleChange() {
    setChecked(!checked);
    if (allChecked) {
      setCheckBoxIds([]);
    } else {
      setCheckBoxIds(records.map((record) => record.id));
    }
  }

  return (
    <div className="border border-t-0 border-r-0 border-l-0 border-gray-200 flex justify-center items-center py-1 h-full">
      <input
        className="mr-3"
        onChange={handleChange}
        checked={checked}
        type="checkbox"
      />
    </div>
  );
};
