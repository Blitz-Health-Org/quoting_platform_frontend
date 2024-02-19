import { RecordContext } from "@/src/context/commissions/RecordContext";
import { useContext, useState } from "react";

export const CheckboxAllCell = () => {
  const [checked, setChecked] = useState<boolean>(false);
  const {
    record: [records],
    checked: [checkedBoxIds, setCheckBoxIds],
  } = useContext(RecordContext);

  if (!records) {
    return <></>;
  }

  const allChecked = records.length === checkedBoxIds.length;

  function handleChange() {
    setChecked(!checked);
    if (allChecked) {
      setCheckBoxIds([]);
    } else {
      setCheckBoxIds(
        (records as Record<string, any>[]).map((record) => record.id),
      );
    }
  }

  return (
    <div className="border bg-slate-200 border-l-0 border-r-0 border-gray-400 flex justify-center items-center py-0.5 h-full">
      <input
        className="mr-3"
        onChange={handleChange}
        checked={checked}
        type="checkbox"
      />
    </div>
  );
};
