import { Dispatch, SetStateAction } from "react";
import { ClassType } from "@/src/types/custom/Class";
import { supabase } from "@/src/supabase";
import { ClientType } from "@/src/types/custom/Client";
import { eq } from "lodash";
import { TierType } from "@/src/components/comparison/utils/calculateTotalCost";
import router from "next/router";
import { Json } from "@/src/types/database/database.types";
import { PlanGroupType } from "@/src/types/custom/PlanGroup";
import { QuoteType } from "@/src/types/custom/Quote";

export type PlanSpecificClassInfoType = {
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

export function getClasses(
  setClasses: Dispatch<SetStateAction<ClassType[]>>,
  setPlanSpecificClassInfo: Dispatch<
    SetStateAction<PlanSpecificClassInfoType[]>
  >,
) {
  async function fetchAndSetCustomClasses(
    client: ClientType,
    planIds: number[],
  ) {
    try {
      const classes = await fetchAndSetClasses(client);
      await fetchAndSetPlanSpecificClasses(classes, planIds);
    } catch {
      alert("Failed to get classes");
      throw Error;
    }
  }

  async function fetchAndSetClasses(client: ClientType) {
    const { data: classData, error: classError } = await supabase
      .from("classes")
      .select("*")
      .eq("client_id", client.id);

    if (classError) {
      throw classError;
    }

    setClasses(classData as any[]);

    return classData;
  }

  async function fetchAndSetPlanSpecificClasses(
    classes: ClassType[],
    planIds: number[],
  ) {
    const classIds = classes.map((classItem) => classItem.id);
    const { data: classData, error: classError } = await supabase
      .from("classes_quotes")
      .select("*")
      .in("class_id", classIds)
      .in("plan_id", planIds);

    if (classError) {
      throw classError;
    }

    setPlanSpecificClassInfo(classData);
  }

  async function handleAddCustomClass(
    client: ClientType,
    planIds: number[],
    newClassName: string,
  ) {
    const newEmptyCustomClass = {
      class_name: newClassName,
      client_id: client.id,
    };

    //update supabase and local
    try {
      const { data: newCreatedEmptyCustomClass, error } = await supabase
        .from("classes")
        .insert(newEmptyCustomClass)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const emptyRates = {
        employee: {
          contribution_percentage: 50,
          num_lives: 0,
        },
        spouse: {
          contribution_percentage: 50,
          num_lives: 0,
        },
        family: {
          contribution_percentage: 50,
          num_lives: 0,
        },
        child: {
          contribution_percentage: 50,
          num_lives: 0,
        },
      };

      const { data: planSpecificClassData, error: classesQuotesError } =
        await supabase
          .from("classes_quotes")
          .insert(
            planIds.map((planId) => {
              return {
                ...emptyRates,
                plan_id: planId,
                class_id: newCreatedEmptyCustomClass.id,
              };
            }),
          )
          .select();

      if (classesQuotesError) {
        throw classesQuotesError;
      }

      setClasses((prev) => {
        return [...prev, newCreatedEmptyCustomClass];
      });

      setPlanSpecificClassInfo((prev) => [...prev, ...planSpecificClassData]);
    } catch {
      alert("Failed to create new class");
      throw Error;
    }
  }

  async function handleUpdateNonPlanSpecificClassInfo(customClass: ClassType) {
    try {
      const { data: customClassData, error } = await supabase
        .from("classes")
        .upsert(customClass)
        .eq("class_id", customClass.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setClasses((prev) => {
        return prev.map((_class) => {
          return _class.id !== customClassData.id ? _class : customClassData;
        });
      });
    } catch {
      alert("Update class failed");
    }
  }

  async function handleUpdatePlanSpecificClassInfo(
    customClass: PlanSpecificClassInfoType,
    planId: number,
  ) {
    try {
      const { data: customClassData, error } = await supabase
        .from("classes_quotes")
        .update(customClass)
        .eq("plan_id", planId)
        .eq("class_id", customClass.class_id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log("customClassData", customClassData);

      setPlanSpecificClassInfo((prev) => {
        const filteredPreviousClassInfo = prev.filter(
          (classItem) =>
            classItem.plan_id !== planId ||
            classItem.class_id !== customClass.class_id,
        );
        return [...filteredPreviousClassInfo, customClassData];
      });
    } catch {
      alert("Update class failed");
    }
  }

  async function handleUpdateCustomClass(
    customClass: ClassType | PlanSpecificClassInfoType,
    quoteId?: number,
  ) {
    if (quoteId) {
      handleUpdatePlanSpecificClassInfo(
        customClass as PlanSpecificClassInfoType,
        quoteId,
      );
    } else {
      handleUpdateNonPlanSpecificClassInfo(customClass as ClassType);
    }
  }

  async function handleDeleteCustomClass(customClass: ClassType) {
    try {
      const { data: customClassData, error } = await supabase
        .from("classes")
        .delete()
        .eq("id", customClass.id);

      if (error) {
        throw error;
      }

      setClasses((prev) => {
        return prev.filter((_class) => {
          return _class.id !== customClass.id;
        });
      });

      setPlanSpecificClassInfo((prev) => {
        console.log(
          "LITTLE BALL",
          prev,
          customClass,
          prev.filter((classItem) => {
            classItem.class_id !== customClass.id;
          }),
        );

        return prev.filter((classItem) => {
          return classItem.class_id !== customClass.id;
        });
      });
    } catch {
      alert("Delete class failed");
    }
  }

  return {
    fetchAndSetCustomClasses,
    handleAddCustomClass,
    handleUpdateCustomClass,
    handleDeleteCustomClass,
  };
}
