type PlanRatesType = RateType[];

type RateType = {
  plan_id: number | undefined;
  spouse_rate: string | undefined;
  employee_rate: string | undefined;
  child_rate: string | undefined;
  family_rate: string | undefined;
};
