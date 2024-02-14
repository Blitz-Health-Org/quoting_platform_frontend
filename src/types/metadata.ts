//TODO: Figure out a way to make sure that this matches the database

//TODO: Check to make sure that only system variables are missing label, or make types stricter
export type FieldType = {
  field: string;
  type: string;
  isDefault: boolean;
  isSystem: boolean;
  isNullable: boolean;
  isRelation?: boolean;
  label?: string;
  placeholder?: string;
};

export const quoteMetadataObject: Record<string, FieldType> = {
  id: {
    field: "id",
    type: "number", //TODO: does it make sense for this to be js types or supabase types?
    isDefault: true,
    isSystem: true,
    isNullable: false,
  },
  created_at: {
    field: "created_at",
    type: "string",
    isDefault: true,
    isSystem: false,
    isNullable: false,
    label: "Creation Date",
  },
  client_id: {
    field: "client_id",
    type: "number",
    isDefault: false,
    isSystem: true,
    isNullable: false,
  },
};

export const clientMetadataObject: Record<string, FieldType> = {
  id: {
    field: "id",
    type: "number", //TODO: does it make sense for this to be js types or supabase types?
    isDefault: true,
    isSystem: true,
    isNullable: false,
  },
  created_at: {
    field: "created_at",
    type: "string",
    isDefault: true,
    isSystem: false,
    isNullable: false,
    label: "Creation Date",
  },
  //   user_id: { //TODO: Implement relation
  //   }
  name: {
    field: "name",
    type: "string",
    isDefault: false,
    isSystem: false,
    label: "Name",
    isNullable: false,
    placeholder: "Acme Corporation Inc.",
  },
  icon: {
    field: "icon",
    type: "string",
    isDefault: false,
    isSystem: false,
    isNullable: true,
    label: "Logo",
  },
  num_lives: {
    field: "num_lives",
    type: "number",
    isDefault: false,
    isSystem: false,
    isNullable: true,
    label: "No. of Lives",
  },
};

//COMMISSIONS

// Define a type for the structure of the fields within each key in metadata
export type PolicyField = {
  value: any; // Use 'any' or a more specific type as needed, e.g., number | string | null | string[] | number[]
  type: string; // This could be more specific if you have a finite set of types, e.g., "bigint" | "timestamp with time zone" | "text" | "double precision" | "double precision[]" | "jsonb" | "status"
  isSystem?: boolean;
  isCalculated?: boolean;
  hasDefault?: boolean;
  isRelation?: boolean;
  relationTable?: string;
  relationIdField?: string;
  relationLabel?: string;
  field: string;
  label?: string;
};

// Define a type for the structure of 'policies'
export type Policy = {
  id: PolicyField;
  created_at: PolicyField;
  policy_id: PolicyField;
  plan_type: PolicyField;
  // payments: PolicyField;
  expected_monthly_revenue: PolicyField;
  owner_id: PolicyField;
  // carrier_id: PolicyField;
  client_id: PolicyField;
  jan_payment: PolicyField;
  feb_payment: PolicyField;
  mar_payment: PolicyField;
  apr_payment: PolicyField;
  may_payment: PolicyField;
  jun_payment: PolicyField;
  jul_payment: PolicyField;
  aug_payment: PolicyField;
  sep_payment: PolicyField;
  oct_payment: PolicyField;
  nov_payment: PolicyField;
  dec_payment: PolicyField;
  status: PolicyField;
  expected_annual_revenue: PolicyField;
  actual_ytd_revenue: PolicyField;
  projected_yearly_revenue: PolicyField;
  monthly_payments: PolicyField;
  client: PolicyField;
  carrier: PolicyField;
  // Add additional fields as necessary
};

// Define a type for the metadata object itself
export type Metadata = {
  policies: Policy;
  // Add additional keys as necessary, following the pattern above
};

export const metadata: Metadata = {
  policies: {
    id: { value: 0, type: "bigint", field: "id", isSystem: true },
    created_at: {
      value: new Date().toISOString(),
      type: "timestamp with time zone",
      field: "created_at",
      hasDefault: true,
      label: "Created At",
    },
    policy_id: {
      value: null,
      type: "text",
      field: "policy_id",
      isSystem: true,
    },
    plan_type: {
      value: null,
      type: "text",
      field: "plan_type",
      label: "Plan Type",
    },
    // payments: {
    //   value: [],
    //   type: "double precision[]",
    //   field: "payments",
    //   label: "Payments",
    // },
    expected_monthly_revenue: {
      value: null,
      type: "double precision",
      field: "expected_monthly_revenue",
      label: "Expected Monthly Revenue",
    },
    owner_id: {
      value: null,
      type: "bigint",
      field: "owner_id",
      isSystem: true,
      isRelation: true,
    },
    // carrier_id: {
    //   value: null,
    //   type: "bigint",
    //   field: "carrier_id",
    //   isRelation: true,
    //   relationTable: "carriers",
    //   relationIdField: "id",
    //   relationLabel: "name",
    // label: "Carrier",
    // },
    client: {
      value: null,
      type: "text",
      field: "client",
      label: "Client",
    },
    carrier: { value: null, type: "text", field: "carrier", label: "Carrier" },
    client_id: {
      value: null,
      type: "bigint",
      field: "client_id",
      isRelation: true,
      relationTable: "clients",
      relationIdField: "id",
    },
    expected_annual_revenue: {
      value: null,
      type: "double precision",
      field: "expected_annual_revenue",
      label: "Expected Annual Revenue",
    },
    actual_ytd_revenue: {
      value: null,
      type: "bigint",
      field: "actual_ytd_revenue",
      isCalculated: true,
      label: "Actual YTD Revenue",
    },
    jan_payment: {
      value: null,
      type: "double precision",
      field: "jan_payment",
      label: "January Payment",
    },
    feb_payment: {
      value: null,
      type: "double precision",
      field: "feb_payment",
      label: "February Payment",
    },
    mar_payment: {
      value: null,
      type: "double precision",
      field: "mar_payment",
      label: "March Payment",
    },
    apr_payment: {
      value: null,
      type: "double precision",
      field: "apr_payment",
      label: "April Payment",
    },
    may_payment: {
      value: null,
      type: "double precision",
      field: "may_payment",
      label: "May Payment",
    },
    jun_payment: {
      value: null,
      type: "double precision",
      field: "jun_payment",
      label: "June Payment",
    },
    jul_payment: {
      value: null,
      type: "double precision",
      field: "jul_payment",
      label: "July Payment",
    },
    aug_payment: {
      value: null,
      type: "double precision",
      field: "aug_payment",
      label: "August Payment",
    },
    sep_payment: {
      value: null,
      type: "double precision",
      field: "sep_payment",
      label: "September Payment",
    },
    oct_payment: {
      value: null,
      type: "double precision",
      field: "oct_payment",
      label: "October Payment",
    },
    nov_payment: {
      value: null,
      type: "double precision",
      field: "nov_payment",
      label: "November Payment",
    },
    dec_payment: {
      value: null,
      type: "double precision",
      field: "dec_payment",
      label: "December Payment",
    },
    status: { value: null, type: "enum", field: "status", label: "Status" },
    projected_yearly_revenue: {
      value: null,
      type: "double precision",
      field: "projected_yearly_revenue",
      isCalculated: true,
      label: "Projected Yearly Revenue",
    },
    monthly_payments: {
      value: null,
      type: "jsonb",
      field: "monthly_payments",
      label: "Monthly Payments",
    },
  },
};

export const emptyPolicyField: PolicyField = {
  value: null,
  type: "",
  field: "",
  // Default type, adjust based on your requirements
  // isSystem and isCalculated are optional and can be omitted if not required for the default context
};

export const emptyPolicy: Policy = {
  id: { ...emptyPolicyField, type: "bigint" },
  created_at: {
    ...emptyPolicyField,
    type: "timestamp with time zone",
    value: new Date().toISOString(),
  }, // Assuming you want the creation date to default to now
  policy_id: { ...emptyPolicyField, isSystem: true },
  plan_type: { ...emptyPolicyField },
  // payments: { ...emptyPolicyField, type: "double precision[]", value: [] },
  expected_monthly_revenue: { ...emptyPolicyField, type: "double precision" },
  owner_id: { ...emptyPolicyField, type: "bigint", isSystem: true },
  // carrier_id: { ...emptyPolicyField, type: "bigint", isSystem: true },
  client_id: { ...emptyPolicyField, type: "bigint", isSystem: true },
  jan_payment: { ...emptyPolicyField, type: "double precision" },
  feb_payment: { ...emptyPolicyField, type: "double precision" },
  mar_payment: { ...emptyPolicyField, type: "double precision" },
  apr_payment: { ...emptyPolicyField, type: "double precision" },
  may_payment: { ...emptyPolicyField, type: "double precision" },
  jun_payment: { ...emptyPolicyField, type: "double precision" },
  jul_payment: { ...emptyPolicyField, type: "double precision" },
  aug_payment: { ...emptyPolicyField, type: "double precision" },
  sep_payment: { ...emptyPolicyField, type: "double precision" },
  oct_payment: { ...emptyPolicyField, type: "double precision" },
  nov_payment: { ...emptyPolicyField, type: "double precision" },
  dec_payment: { ...emptyPolicyField, type: "double precision" },
  status: { ...emptyPolicyField, type: "status" }, // Assuming 'status' is a predefined type or enum in your application
  expected_annual_revenue: { ...emptyPolicyField, type: "double precision" },
  actual_ytd_revenue: {
    ...emptyPolicyField,
    type: "bigint",
    isCalculated: true,
  },
  projected_yearly_revenue: {
    ...emptyPolicyField,
    type: "double precision",
    isCalculated: true,
  },
  monthly_payments: { ...emptyPolicyField, type: "jsonb", value: {} },
  client: { ...emptyPolicyField },
  carrier: { ...emptyPolicyField },
  // Continue with the rest of your fields
};
