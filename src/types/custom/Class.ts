export type ClassType = {
  id?: number;
  client_id?: number;
  class_name: string;
  is_default: boolean;
};

export type PlanSpecificClassInfoType = PlanSpecificClassType[];

export type PlanSpecificClassType = {
  id: number;
  plan_id: number;
  class_id: number;
  employee: {
    contribution_percentage: number;
    num_lives: number;
  };
  spouse: {
    contribution_percentage: number;
    num_lives: number;
  };
  child: {
    contribution_percentage: number;
    num_lives: number;
  };
  family: {
    contribution_percentage: number;
    num_lives: number;
  };
};
