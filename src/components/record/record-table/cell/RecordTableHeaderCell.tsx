//implement overflow scroll

import { PolicyField } from "@/src/types/metadata";

export function RecordTableHeaderCell({ field }: { field: PolicyField }) {
  const label = field.label;

  return (
    <div className="w-full h-full ">
      <textarea
        contentEditable={true}
        className="block overflow-x-scroll border-l-0 border-t-1 font-semibold resize-none h-7 text-sm border border-1 border-gray-200 w-32 py-1 px-1 z-0 focus:outline-0"
        value={label}
        style={{ whiteSpace: "nowrap" }}
      />
    </div>
  );
}
