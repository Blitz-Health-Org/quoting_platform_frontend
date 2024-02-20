export const collapsedVisibleFields = [
  {
    type: "text",
    field: "plan_type",
    label: "Plan Type",
  },
  {
    type: "bigint",
    field: "carrier_id",
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
    label: "Proj. Yearly Revenue",
  },
  {
    type: "double precision",
    field: "expected_monthly_revenue",
    label: "Exp. Monthly Revenue",
  },
];
