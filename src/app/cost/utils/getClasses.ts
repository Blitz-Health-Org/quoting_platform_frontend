import { Dispatch, SetStateAction } from "react";
import { ClassType, PlanSpecificClassInfoType, PlanSpecificClassType } from "@/src/types/custom/Class";
import { supabase } from "@/src/supabase";
import { ClientType } from "@/src/types/custom/Client";
import { eq } from "lodash";
import { TierType } from "@/src/components/comparison/utils/calculateTotalCost";
import router from "next/router";
import { Json } from "@/src/types/database/database.types";
import { PlanGroupType } from "@/src/types/custom/PlanGroup";
import { QuoteType } from "@/src/types/custom/Quote";

export function getClasses(
  setClasses: Dispatch<SetStateAction<ClassType[]>>,
  setPlanSpecificClassInfo: Dispatch<
    SetStateAction<PlanSpecificClassInfoType>
  >,
) {
  async function fetchAndSetClasses(
    client: ClientType,
    planIds: number[],
  ) {
    try {
      const classes = await fetchAndSetNonPlanSpecificClassInfo(client);
      await fetchAndSetPlanSpecificClassInfo(classes, planIds);
    } catch {
      alert("Failed to get classes");
      throw Error;
    }
  }

  async function fetchAndSetNonPlanSpecificClassInfo(client: ClientType) {
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

  async function fetchAndSetPlanSpecificClassInfo(
    classes: ClassType[],
    planIds: number[],
  ) {

    let data;
    const classIds = classes.map((classItem) => classItem.id);
    const { data: classData, error: classError } = await supabase
      .from("classes_quotes")
      .select("*")
      .in("class_id", classIds)
      .in("plan_id", planIds);

    if (classError) {
      throw classError;
    }

    data=classData;

    const planSpecificClassMissingList: [number, number][] = []
    for (const classId of classIds) {
      for (const planId of planIds) {
        if (classId && planId && classData.find(classItem => classItem.class_id === classId && classItem.plan_id === planId) === undefined) {
          planSpecificClassMissingList.push([classId, planId])
        } 
      }
    }

      if (planSpecificClassMissingList.length > 0) {
        console.log("MISSING", planSpecificClassMissingList)

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

      const { error: planSpecificClassDataError } =
        await supabase
          .from("classes_quotes")
          .insert(
            planSpecificClassMissingList.map((classPlan) => {
              return {
                ...emptyRates,
                plan_id: classPlan[1],
                class_id: classPlan[0],
              };
            }),
          )
          .select();

      if (planSpecificClassDataError) {
        throw planSpecificClassDataError;
      }

      const { data: classData, error: classError } = await supabase
      .from("classes_quotes")
      .select("*")
      .in("class_id", classIds)
      .in("plan_id", planIds);

    if (classError) {
      throw classError;
    }
    data = classData;
      
    }
  
    setPlanSpecificClassInfo(data);
  }

  async function handleAddClass(
    client: ClientType,
    planIds: number[],
    newClassName: string,
    isDefault: boolean,
  ) {
    const newEmptyCustomClass = {
      class_name: newClassName,
      client_id: client.id,
      is_default: isDefault
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

  async function handleAddCustomClass(client: ClientType,
    planIds: number[],
    newClassName: string) {
      handleAddClass(client, planIds, newClassName, false);
    }

  async function handleUpdateNonPlanSpecificClassInfo(customClass: ClassType) {
    try {
      const { data: customClassData, error } = await supabase
        .from("classes")
        .update(customClass)
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
    customClass: PlanSpecificClassType,
    planId: number,
  ) {

    console.log('custom class', customClass)
    try {
      const { data: customClassData, error } = await supabase
        .from("classes_quotes")
        .update(customClass)
        .eq("id", customClass.id)
        .select()
        .single();

      if (error) {
        throw error;
      }


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

  async function handleUpdateClass(
    customClass: ClassType | PlanSpecificClassType,
    quoteId?: number,
  ) {
    if (quoteId) {
      handleUpdatePlanSpecificClassInfo(
        customClass as PlanSpecificClassType,
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
        

        return prev.filter((classItem) => {
          return classItem.class_id !== customClass.id;
        });
      });
    } catch {
      alert("Delete class failed");
    }
  }

  return {
    fetchAndSetClasses,
    handleAddCustomClass,
    handleUpdateClass,
    handleDeleteCustomClass,
  };
}
