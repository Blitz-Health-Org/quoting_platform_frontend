import { PolicyField } from "../metadata";

export function isNonUpdatable(field: PolicyField) {
  return field.isCalculated;
}
