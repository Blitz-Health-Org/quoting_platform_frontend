export type ClassType = {
  id?: number;
  client_id?: number;
  class_name: string;
};

export type PlanSpecificClassType = {
  employee: {
    contribution_percentage: number | null;
    num_lives: number | null;
  };
  spouse: {
    contribution_percentage: number | null;
    num_lives: number | null;
  };
  child: {
    contribution_percentage: number | null;
    num_lives: number | null;
  };
  family: {
    contribution_percentage: number | null;
    num_lives: number | null;
  };
};
