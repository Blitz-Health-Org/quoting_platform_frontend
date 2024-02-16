import { FieldType } from "../metadata";

export function isFieldVisible(field: FieldType) {
  return !field.isSystem;
}
