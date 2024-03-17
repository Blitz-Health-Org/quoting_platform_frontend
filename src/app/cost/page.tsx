"use client";

import { ClientType } from "@/src/types/custom/Client";
import { PlanGroupType } from "@/src/types/custom/PlanGroup";
import { ClassType } from "@/src/types/custom/Class";
import { supabase } from "@/src/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { calculateTotalCost } from "@/src/components/comparison/utils/calculateTotalCost";
import { Json } from "@/src/types/database/database.types";

type ContributionPercentagesType = {
  employee_contribution: number;
  spouse_contribution: number;
  family_contribution: number;
  child_contribution: number;
};

export default function CostPage() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const planGroupId = searchParams.get("planId");

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);

  const [planGroup, setPlanGroup] = useState<PlanGroupType | null>(null);
  const [client, setClient] = useState<ClientType | null>(null);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [contributionPercentages, setContributionPercentages] =
    useState<ContributionPercentagesType>(
      {} as unknown as ContributionPercentagesType,
    );

  const [isFirstOpen, setIsFirstOpen] = useState<boolean>(true);
  const [isSecondOpen, setIsSecondOpen] = useState<boolean>(true);
  const [isThirdOpen, setIsThirdOpen] = useState<boolean>(true);

  //LOAD DATA
  //num_lives
  //rates
  //contribution
  //classes

  useEffect(() => {
    fetchClient();
  }, []);

  const fetchClient = async () => {
    try {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (clientError) {
        router.push("/404");
        return;
      }

      setClient(clientData);
      const planGroup = clientData.connected_plans.find(
        (planGroup: any) => planGroup.id === planGroupId,
      );

      setPlanGroup(planGroup);

      if (clientData.custom_classes?.length) {
        setClasses(clientData.custom_classes);
      } else {
        const defaultClass: ClassType[] = [
          {
            class_name: "default",
            employee: {
              contribution_percentage: 50,
              num_lives: clientData.census_data?.employee_num as number,
            },
            spouse: {
              contribution_percentage: 50,
              num_lives: clientData.census_data?.spouse_num as number,
            },
            family: {
              contribution_percentage: 50,
              num_lives: clientData.census_data?.family_num as number,
            },
            child: {
              contribution_percentage: 50,
              num_lives: clientData.census_data?.child_num as number,
            },
          },
        ];

        setClasses(defaultClass);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error occurred. Sending you back to home page!");
      router.push("/");
      // Optionally handle errors, such as setting an error state or showing a notification
    }
  };

  if (loading) {
    return <></>;
  }

  //CALCULATE VARS
  //If loading is finished planGroup, client, and custom classes should be set, explicit typing

  const rates = planGroup?.selectedQuotes.map((plan) => {
    return {
      [plan.id]: {
        employee: (plan.data as Json)?.["employee_rate"],
        spouse: (plan.data as Json)?.["spouse_rate"],
        child: (plan.data as Json)?.child_rate,
        family: (plan.data as Json)?.family_rate,
      },
    };
  });

  return (
    <div className="w-full p-4">
      <div className="flex flex-col">
        {/* First Collapsible Component */}
        <button
          onClick={() => setIsFirstOpen(!isFirstOpen)}
          className="w-full text-left py-2 px-4 font-semibold rounded-md mb-2"
        >
          Census Data
        </button>
        {isFirstOpen && (
          <div className="w-full min-h-[50px] bg-gray-100 p-4 mb-4 rounded-md">
            {/* Section 1 content goes here */}
          </div>
        )}

        {/* Second Collapsible Component */}
        <button
          onClick={() => setIsSecondOpen(!isSecondOpen)}
          className="w-full text-left py-2 px-4 font-semibold rounded-md mb-2"
        >
          Rates
        </button>
        {isSecondOpen && (
          <div className="w-full min-h-[50px] bg-gray-100 p-4 mb-4 rounded-md">
            custom classes toggle
            {customClasses.length === 0
              ? {
                  defaultClass,
                }
              : null}
          </div>
        )}

        {/* Third Collapsible Component */}
        <button
          onClick={() => setIsThirdOpen(!isThirdOpen)}
          className="w-full text-left py-2 px-4 font-semibold rounded-md"
        >
          Plans
        </button>
        {isThirdOpen && (
          <div className="w-full min-h-[50px] bg-gray-100 p-4 mb-4 rounded-md">
            {/* Section 3 content goes here */}
          </div>
        )}
      </div>
      <div className="overflow-auto w-full p-4 rounded-md border border-black">
        {/* Display content goes here */}
        <>
          <div>Employer pays: </div>
          <div>Employee pays:</div>
        </>
      </div>
    </div>
  );
}
