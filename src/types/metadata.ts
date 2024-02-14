//TODO: Figure out a way to make sure that this matches the database

//TODO: Check to make sure that only system variables are missing label, or make types stricter
export type ClientFieldType = {
  field: string;
  type: string;
  isDefault: boolean;
  isSystem: boolean;
  isNullable: boolean;
  label?: string;
  placeholder?: string;
};

export const clientMetadataObject: Record<string, ClientFieldType> = {
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
