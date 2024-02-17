"use client";

import RecordContainer from "@/src/components/record/record-table/RecordContainer";

export const CommissionTablePage = () => {
  const tableName = {
    singular: "Policy",
    plural: "Policies",
  };

  return <RecordContainer tableName={tableName} />;
};
