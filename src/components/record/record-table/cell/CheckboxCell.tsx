import { RecordContext } from "@/src/context/commissions/RecordContext";
import { useContext, useState } from "react";

export const CheckboxCell = ({ rowId }: { rowId: number }) => {
  const {
    checked: [checkedBoxIds, setCheckedBoxIds],
  } = useContext(RecordContext);

  const checked = checkedBoxIds.includes(rowId);

  function handleChange() {
    if (checkedBoxIds.includes(rowId)) {
      setCheckedBoxIds(checkedBoxIds.filter((id) => id !== rowId));
    } else {
      setCheckedBoxIds(checkedBoxIds.concat([rowId]));
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
