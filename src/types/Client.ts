import { StaticImport } from "next/dist/shared/lib/get-img-props";

export type Client = {
  plans: Plan[];
  quotes: Quote[];
  num_lives: number;
  icon: string | StaticImport;
};

export type Plan = {};
export type Quote = {};
