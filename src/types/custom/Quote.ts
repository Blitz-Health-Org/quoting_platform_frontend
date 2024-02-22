import { Database } from "@/src/types/database/database.types";

// export type Client = {
//   plans: Plan[];
//   quotes: Quote[];
//   num_lives: number;
//   icon: string | StaticImport;
// };

// export type Plan = {};
// export type Quote = {};

export type QuoteType = Database["public"]["Tables"]["clients"]["Row"];
