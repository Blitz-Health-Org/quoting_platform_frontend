import { RecordContext } from "@/src/context/commissions/RecordContext";
import { useContext, useState } from "react";

export const CheckboxCell = ({
  rowId,
  statusColor,
}: {
  rowId: number;
  statusColor: string;
}) => {
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
    <div
      className={`${statusColor} flex justify-center items-center py-0.5 h-full`}
    >
      <input
        className="mr-3"
        onChange={handleChange}
        checked={checked}
        type="checkbox"
      />
    </div>
  );
};
