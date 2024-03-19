import { QuoteType } from "./Quote";

export type PlanGroupType = {
  id: string;
  name: string;
  selectedQuotes: QuoteType[];
};
