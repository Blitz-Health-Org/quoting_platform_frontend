import { Metadata, metadata } from "@/src/metadata/metadata";
import { Database } from "@/src/types/database.types";

type RowType<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Row"];

const order = [
  "policy_id",
  "client",
  "plan_type",
  "carrier",
  "expected_annual_revenue",
  "expected_monthly_revenue",
  "actual_ytd_revenue",
  "jan_payment",
  "feb_payment",
  "mar_payment",
  "apr_payment",
  "may_payment",
  "jun_payment",
  "jul_payment",
  "aug_payment",
  "sep_payment",
  "oct_payment",
  "nov_payment",
  "dec_payment",
  // Add more specific fields here if needed
];

export function getRecordFields(tableName: string) {
  return metadata[tableName as keyof Metadata];
}

// }
// export function getRecordFields(tableName: string) {

//   const fields = data.reduce((acc: any, item: any) => {
//     Object.keys(item).forEach((key) => {
//       if (!acc[key] && key !== "created_at") {
//         // Exclude 'created_at'
//         acc[key] = {
//           value: item[key],
//           type: typeof item[key],
//           isRelation: typeof item[key] === "object",
//           isSystem: key === "id",
//           isDefault: key === "id" || key === "created_at",
//         };
//       }
//     });
//     return acc;
//   }, {});

//   // Sort fields based on predefined order, place unspecified fields at the end
//   const sortedFields = Object.keys(fields)
//     .sort((a, b) => {
//       let indexA = order.indexOf(a);
//       let indexB = order.indexOf(b);
//       indexA = indexA === -1 ? Infinity : indexA;
//       indexB = indexB === -1 ? Infinity : indexB;
//       return indexA - indexB;
//     })
//     .reduce((acc: any, key: string) => {
//       acc[key] = fields[key];
//       return acc;
//     }, {});

//   return sortedFields;
