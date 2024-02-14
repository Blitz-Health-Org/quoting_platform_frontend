//TODO: Group by totaling when we have numbers

import { AggregationRowCell } from "@/src/components/record/record-table/cell/AggregationRowCell";
import { PolicyField } from "@/src/metadata/metadata";
import { MdAttachMoney } from "react-icons/md";

type TableGroupAggregationRowProps = {
  records: Record<any, any>[];
  visibleFieldDefinitionObjects: Record<any, any> | null;
};

export const TableGroupAggregationRow = ({
  records,
  visibleFieldDefinitionObjects,
}: TableGroupAggregationRowProps) => {
  return (
    <div className="w-full border mb-5 pr-2 pt-1">
      <div className="flex w-full justify-end items-center">
        <MdAttachMoney className="w-4 h-4" />
        {visibleFieldDefinitionObjects &&
          Object.entries(visibleFieldDefinitionObjects).map(
            ([field, value]) => {
              return (
                <AggregationRowCell
                  records={records}
                  entry={[field, value]}
                  key={field}
                />
              );
            },
          )}
      </div>
    </div>
  );
};
