import { PolicyField } from "../metadata";

export function isFieldVisible(field: PolicyField) {
  return !field.isSystem && !(field.field === "client_id");
}
