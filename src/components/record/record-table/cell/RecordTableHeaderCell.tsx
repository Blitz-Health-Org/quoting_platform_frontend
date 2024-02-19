//implement overflow scroll

import { PolicyField } from "@/src/types/metadata";

export function RecordTableHeaderCell({ field }: { field: PolicyField }) {
  const label = field.label;

  return (
    <div className="min-w-32 h-full bg-slate-200">
      <textarea
        contentEditable={true}
        className="block w-full overflow-x-scroll bg-transparent border-l-0 border-t-1 font-semibold resize-none h-7 text-sm border border-1 border-gray-400  py-1 px-1 z-0 focus:outline-0"
        value={label}
        style={{ whiteSpace: "nowrap" }}
      />
    </div>
  );
}
