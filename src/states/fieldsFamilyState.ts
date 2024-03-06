import { atomFamily } from "recoil";

// Define the atomFamily outside of any component or hook
export const fieldsFamilyState = atomFamily<any, any>({
  key: "fieldsFamilyState",
  default: null,
});
