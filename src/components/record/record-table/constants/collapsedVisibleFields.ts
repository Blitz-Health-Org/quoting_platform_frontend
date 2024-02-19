export const collapsedVisibleFields = [
  {
    type: "text",
    field: "plan_type",
    label: "Plan Type",
  },

  {
    type: "double precision",
    field: "expected_monthly_revenue",
    label: "Expected Monthly Revenue",
  },
  {
    type: "bigint",
    field: "carrier",
    isRelation: true,
    relationTable: "carriers",
    relationLabel: "name",
    relationIdField: "id",
    label: "Carrier",
  },
  {
    type: "bigint",
    field: "client_id",
    isRelation: true,
    relationTable: "clients",
    relationLabel: "name",
    relationIdField: "id",
    label: "Client",
  },
  {
    type: "bigint",
    field: "actual_ytd_revenue",
    isCalculated: true,
    label: "Actual YTD Revenue",
  },
  { type: "enum", field: "status", label: "Status" },
  {
    type: "double precision",
    field: "projected_yearly_revenue",
    isCalculated: true,
    label: "Projected Yearly Revenue",
  },
];
