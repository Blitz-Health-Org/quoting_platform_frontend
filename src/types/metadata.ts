//TODO: Figure out a way to make sure that this matches the database

type BaseFieldType = {
  field: string;
  type: string;
  isDefault: boolean;
  isNullable: boolean;
  isRelation?: boolean;
  placeholder?: string;
  plan_details?: string;
  json_structure?: string;
};

// Extension for system fields without 'label'
export type SystemField = BaseFieldType & {
  isSystem: true;
};

// Extension for non-system fields with 'label'
export type NonSystemField = BaseFieldType & {
  isSystem: false;
  label: string; // Make 'label' mandatory for non-system fields
};

// Combined type using union
export type FieldType = SystemField | NonSystemField;

export const quoteMetadataObject: Record<string, FieldType> = {
  id: {
    field: "id",
    type: "number", //TODO: does it make sense for this to be js types or supabase types?
    isDefault: true,
    isSystem: true,
    isNullable: false,
  },
  name: {
    field: "name",
    type: "string",
    isDefault: false,
    isSystem: false,
    isNullable: false,
    label: "Name",
  },
  website: {
    field: "website",
    type: "string",
    isDefault: false,
    isSystem: false,
    isNullable: false,
    label: "Website",
  },
  created_at: {
    field: "created_at",
    type: "string",
    isDefault: true,
    isSystem: true,
    isNullable: false,
  },
  client_id: {
    field: "client_id",
    type: "number",
    isDefault: false,
    isSystem: true,
    isNullable: false,
  },
  deductibles: {
    field: "deductibles",
    type: "jsonb",
    isDefault: true,
    isSystem: false,
    isNullable: true,
    json_structure: `{
      "overall": {
        "label": "Overall (Ind./Fam.)"
      },
      "medical": {
        "label": "Medical (Ind./Fam.)"
      },
      "prescription_drug": {
        "label": "Prescription Drug"
      },
      "oop": {
        "label": "Out-of-Pocket (Ind./Fam.)"
      }
    }`,
    label: "Deductibles",
  },
  visit_to_provider: {
    field: "visit_to_provider",
    type: "jsonb",
    isDefault: true,
    isSystem: false,
    isNullable: false,
    json_structure: `{
      "primary_care_visit": {
        "label": "Primary Care Visit"
      },
      "specialist_visit": {
        "label": "Specialist Visit"
      },
      "preventative_care": {
        "label": "Preventative Care"
      }
    }`,
    label: "Visit to Provider",
  },
  test: {
    field: "test",
    type: "jsonb",
    isDefault: true,
    isSystem: false,
    isNullable: false,
    json_structure: `{
      "laboratory_test": {
        "label": "Laboratory Test"
      },
      "x_rays_diagnostics": {
        "label": "X-Rays / Diagnostics"
      },
      "imaging": {
        "label": "Imaging"
      }
    }`,
    label: "Plan Details",
  },
  drugs: {
    field: "drugs",
    type: "jsonb",
    isDefault: true,
    isSystem: false,
    isNullable: false,
    json_structure: `{
      "tier_1": {
        "label": "Tier 1"
      },
      "tier_2": {
        "label": "Tier 2"
      },
      "tier_3": {
        "label": "Tier 3"
      },
      "tier_4": {
        "label": "Tier 4"
      }
    }`,
    label: "Drugs",
  },
  outpatient_surgery: {
    field: "outpatient_surgery",
    type: "jsonb",
    isDefault: true,
    isSystem: false,
    isNullable: false,
    json_structure: `{
      "facility_fee": {
        "label": "Facility Fee"
      }
    }`,
    label: "Outpatient Surgery",
  },
  need_immediate_attention: {
    field: "need_immediate_attention",
    type: "jsonb",
    isDefault: true,
    isSystem: false,
    isNullable: false,
    json_structure: `{
      "emergency_room_services": {
        "label": "Emergency Room Services"
      },
      "emergency_medical_trans": {
        "label": "Emergency Medical Trans."
      },
      "urgent_care": {
        "label": "Urgent Care"
      }
    }`,
    label: "Need Immediate Attention",
  },
  hospital_stay: {
    field: "hospital_stay",
    type: "jsonb",
    isDefault: true,
    isSystem: false,
    isNullable: false,
    json_structure: `{
      "facility_fee": {
        "label": "Facility Fee"
      },
      "physician_surgeon_fee": {
        "label": "Physician/Surgeon Fee"
      }
    }`,
    label: "Hospital Stay",
  },
  mental_behavior_sud: {
    field: "mental_behavior_sud",
    type: "jsonb",
    isDefault: true,
    isSystem: false,
    isNullable: false,
    json_structure: `{
      "outpatient_mental_health": {
        "label": "Outpatient Mental Health"
      },
      "inpatient_mental_health": {
        "label": "Inpatient Mental Health"
      },
      "sud_outpatient": {
        "label": "SUD - Outpatient"
      },
      "sud_inpatient": {
        "label": "SUD - Inpatient"
      }
    }`,
    label: "Mental/Behavior/SUD",
  },
  other_special_health_needs: {
    field: "other_special_health_needs",
    type: "jsonb",
    isDefault: true,
    isSystem: false,
    isNullable: false,
    json_structure: `{
      "rehabilitation": {
        "label": "Rehabilitation"
      },
      "durable_medical_equipment": {
        "label": "Durable Medical Equipment"
      }
    }`,
    label: "Other Special Health Needs",
  },
  premiums_enrollment: {
    field: "premiums_enrollment",
    type: "jsonb",
    isDefault: true,
    isSystem: false,
    isNullable: false,
    json_structure: `{
      "ee_only": {
        "label": "EE Only"
      },
      "ee_spouse": {
        "label": "EE + Spouse"
      },
      "ee_child": {
        "label": "EE + Child"
      },
      "ee_family": {
        "label": "EE + Family"
      }
    }`,
    label: "Premiums/Enrollment",
  },
  effective_date: {
    field: "effective_date",
    type: "string", // Assuming this is a date string
    isDefault: false,
    isSystem: false,
    isNullable: false,
    label: "Effective Date",
  },
  metal_tier: {
    field: "metal_tier",
    type: "string", // This could be an enum if you have specific metal tiers
    isDefault: false,
    isSystem: false,
    isNullable: false,
    label: "Metal Tier",
  },
  plan_name: {
    field: "plan_name",
    type: "string",
    isDefault: false,
    isSystem: false,
    isNullable: false,
    label: "Plan Name",
  },
  provider_network: {
    field: "provider_network",
    type: "string",
    isDefault: false,
    isSystem: false,
    isNullable: false,
    label: "Provider Network",
  },
  // network_status: {
  //   field: "network_status",
  //   type: "string", // This could also be an enum if there are specific statuses
  //   isDefault: false,
  //   isSystem: false,
  //   isNullable: false,
  //   label: "Network Status",
  // },
  plan_type: {
    field: "plan_type",
    type: "string",
    isDefault: false,
    isSystem: false,
    isNullable: false,
    label: "Plan Type",
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
    isSystem: true,
    isNullable: false,
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
  carrier_id: PolicyField;
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
  // client: PolicyField;
  // carrier: PolicyField;
  // Add additional fields as necessary
};

// Define a type for the metadata object itself
export type Metadata = {
  policies: Policy;
  // Add additional keys as necessary, following the pattern above
};

export const metadata: Metadata = {
  policies: {
    id: { type: "bigint", field: "id", isSystem: true },
    created_at: {
      type: "timestamp with time zone",
      field: "created_at",
      hasDefault: true,
      label: "Created At",
      isSystem: true,
    },
    policy_id: {
      type: "text",
      field: "policy_id",
      isSystem: true,
    },
    plan_type: {
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
      type: "double precision",
      field: "expected_monthly_revenue",
      label: "Exp. Monthly Revenue",
    },
    owner_id: {
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
    // client: {
    //   type: "text",
    //   field: "client",
    //   label: "Client",
    // },
    carrier_id: {
      type: "bigint",
      field: "carrier_id",
      isRelation: true,
      relationTable: "carriers",
      relationLabel: "name",
      relationIdField: "id",
      label: "Carrier",
    },
    client_id: {
      type: "bigint",
      field: "client_id",
      isRelation: true,
      relationTable: "clients",
      relationLabel: "name",
      relationIdField: "id",
      label: "Client",
    },
    expected_annual_revenue: {
      type: "double precision",
      field: "expected_annual_revenue",
      label: "Expected Annual Revenue",
      isCalculated: true,
    },
    actual_ytd_revenue: {
      type: "bigint",
      field: "actual_ytd_revenue",
      isCalculated: true,
      label: "Actual YTD Revenue",
    },
    jan_payment: {
      type: "double precision",
      field: "jan_payment",
      label: "January Payment",
    },
    feb_payment: {
      type: "double precision",
      field: "feb_payment",
      label: "February Payment",
    },
    mar_payment: {
      type: "double precision",
      field: "mar_payment",
      label: "March Payment",
    },
    apr_payment: {
      type: "double precision",
      field: "apr_payment",
      label: "April Payment",
    },
    may_payment: {
      type: "double precision",
      field: "may_payment",
      label: "May Payment",
    },
    jun_payment: {
      type: "double precision",
      field: "jun_payment",
      label: "June Payment",
    },
    jul_payment: {
      type: "double precision",
      field: "jul_payment",
      label: "July Payment",
    },
    aug_payment: {
      type: "double precision",
      field: "aug_payment",
      label: "August Payment",
    },
    sep_payment: {
      type: "double precision",
      field: "sep_payment",
      label: "September Payment",
    },
    oct_payment: {
      type: "double precision",
      field: "oct_payment",
      label: "October Payment",
    },
    nov_payment: {
      type: "double precision",
      field: "nov_payment",
      label: "November Payment",
    },
    dec_payment: {
      type: "double precision",
      field: "dec_payment",
      label: "December Payment",
    },
    status: { type: "enum", field: "status", label: "Status" },
    projected_yearly_revenue: {
      type: "double precision",
      field: "projected_yearly_revenue",
      isCalculated: true,
      label: "Proj. Yearly Revenue",
    },
    monthly_payments: {
      type: "jsonb",
      field: "monthly_payments",
      label: "Monthly Payments",
    },
  },
};

export const emptyPolicyField: PolicyField = {
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
  }, // Assuming you want the creation date to default to now
  policy_id: { ...emptyPolicyField, isSystem: true },
  plan_type: { ...emptyPolicyField },
  // payments: { ...emptyPolicyField, type: "double precision[]", value: [] },
  expected_monthly_revenue: { ...emptyPolicyField, type: "double precision" },
  owner_id: { ...emptyPolicyField, type: "bigint", isSystem: true },
  // carrier_id: { ...emptyPolicyField, type: "bigint", isSystem: true },
  // client_id: { ...emptyPolicyField, type: "bigint", isSystem: true },
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
  monthly_payments: { ...emptyPolicyField, type: "jsonb" },
  client_id: { ...emptyPolicyField },
  carrier_id: { ...emptyPolicyField },
  // Continue with the rest of your fields
};
