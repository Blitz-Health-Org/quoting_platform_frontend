"use client";

import { ClientType } from "@/src/types/custom/Client";
import { PlanGroupType } from "@/src/types/custom/PlanGroup";
import { ClassType, PlanSpecificClassInfoType } from "@/src/types/custom/Class";
import { supabase } from "@/src/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { calculateTotalCost } from "@/src/components/comparison/utils/calculateTotalCost";
import { Json } from "@/src/types/database/database.types";
import { cleanInput } from "@/src/components/comparison/utils/cleanInput";
import { getCensusData } from "./utils/getCensusData";
import { getClasses } from "./utils/getClasses";
import { CensusDataSection } from "./components/CensusDataSection";
import { PlanSection } from "./components/PlanSection";
import { ClassSection } from "./components/ClassSection";
import { QuoteType } from "@/src/types/custom/Quote";
import { useLocalStorage } from "@/src/utils/useLocalStorage";
import { Navbar } from "@/src/components/comparison/Navbar";
import { IconBuilding } from "@tabler/icons-react";
import { IoIosArrowDown, IoIosArrowUp, IoMdArrowBack, IoMdEye, IoMdEyeOff} from "react-icons/io";

export type CensusDataType = {
  employee: {
    num_lives: number | null;
  };
  spouse: {
    num_lives: number | null;
  };
  family: {
    num_lives: number | null;
  };
  child: {
    num_lives: number | null;
  };
};

export default function CostPage() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");

  const planGroupId = parseInt(searchParams.get("planId") as string);

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);

  const [client, setClient] = useState<ClientType | null>(null);
  const [planGroup, setPlanGroup] = useState<PlanGroupType | null>(null);
  const [isCustomClassesActivated, setIsCustomClassesActivated] =
    useLocalStorage<boolean>("isCustomClassesActivated", false);
  const [classes, setClasses] = useState<ClassType[]>([]);

  let defaultOrCustomClasses;
  if (isCustomClassesActivated) {
    defaultOrCustomClasses = (classes.filter(classItem => !classItem.is_default))
} else {
    defaultOrCustomClasses = (classes.filter(classItem => classItem.is_default))
}


  const [planSpecificClassInfo, setPlanSpecificClassInfo] = useState<
    PlanSpecificClassInfoType
  >([]);
  const [censusData, setCensusData] = useState<CensusDataType>({
    employee: {
      num_lives: null,
    },
    spouse: {
      num_lives: null,
    },
    child: {
      num_lives: null,
    },
    family: {
      num_lives: null,
    },
  });
  //   const [rates, setRates] = useState<>(null);

  const [isFirstOpen, setIsFirstOpen] = useState<boolean>(true);
  const [isSecondOpen, setIsSecondOpen] = useState<boolean>(true);
  const [isThirdOpen, setIsThirdOpen] = useState<boolean>(true);

  //extracted logic for readability, sets both plan specific and non-planspecific
  const {
    fetchAndSetClasses,
    handleAddCustomClass,
    handleUpdateClass,
    handleDeleteCustomClass,
  } = getClasses(setClasses, setPlanSpecificClassInfo);
  const { handleUpdateCensusData } = getCensusData(setCensusData);
  //   const updateRates = getUpdateRates(setRates);

  //LOAD DATA
  //num_lives (census data)
  //rates (plan_group)
  //contribution (classes)

  function sendToSelect() {
    router.push(`/select?clientId=${client?.id}`);
  }

  useEffect(() => {
    if (loading) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    //fetch client
    try {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (clientError) {
        alert(clientId);
        router.push("/404");
        return;
      }

      setClient(clientData);

      setCensusData(clientData.census_data);

      const newPlanGroup = (
        clientData.connected_plans as unknown as PlanGroupType[]
      ).find((planGroup: any) => {
        return planGroup.id === planGroupId;
      }) as PlanGroupType;
      setPlanGroup(newPlanGroup);

      const plans = newPlanGroup.selectedQuotes;
      const planIds = plans.map((plan) => plan.id);

      //fetches custom classes and planspecific
      await fetchAndSetClasses(clientData, planIds);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error occurred. Sending you back to home page!");
      router.push("/");
    }
  };

  if (loading) {
    return <></>;
  }

  //CALCULATE VARS
  //If loading is finished planGroup, planSpecificClassInfo, client, and classes should be set, explicit typing

  //toggle custom classes (disables default)


  const plans = (planGroup as PlanGroupType).selectedQuotes;
  const planIds = plans.map((plan) => plan.id);

  return (
    <main className="flex w-full h-screen overflow-hidden pl-4 md:pl-0 bg-gray-100">
    <Navbar selected="Quotes" />
    <div className="w-full md:w-6/7 flex-col h-full overflow-auto p-4">
    <div className="flex items-center text-sm md:text-base mt-2">
      <button
        className="flex items-center"
        onClick={() => sendToSelect()}
      >
        <IoMdArrowBack />
        <p className="ml-2 mr-2">Clients / Cost Breakdown /</p>
      </button>
      <IconBuilding className="h-5 w-5 mr-2" />
      <p className="mr-2">{client?.name || "Client"}</p>
      {/* <p className="mr-1">/ Quotes</p>
  <p className="mr-1 text-gray-400 text-xs">•</p>
  <p className="text-gray-400">({quotes.length})</p> */}
    </div>
    <div className="w-full p-4 bg-white outline outline-1 outline-gray-200 rounded-md mt-4">
      <div className="flex gap-4">

      <div className="flex flex-col w-1/5">
        <div>
        <button
          onClick={() => setIsFirstOpen(!isFirstOpen)}
          className="w-full flex justify-between items-center py-2 font-semibold rounded-md mb-2"
        >
          <p>Census</p>
          {isFirstOpen ? <IoIosArrowDown/> : <IoIosArrowUp/>} 
        </button>
        {isFirstOpen && (
          <div className="w-full min-h-[50px] mb-4 rounded-md">
            <CensusDataSection
              censusData={censusData}
              setCensusData={setCensusData}
              onSave={(editedCensusData: CensusDataType) => {
                handleUpdateCensusData(client as ClientType, editedCensusData);
              }}
            />
          </div>
        )}
        </div>

        <div>
        <button
          onClick={() => setIsSecondOpen(!isSecondOpen)}
          className="w-full flex justify-between text-left py-2 font-semibold rounded-md mb-2"
        >
          <p>Classes</p>
          {isSecondOpen ? <IoIosArrowDown/> : <IoIosArrowUp/>} 
        </button>
        {isSecondOpen && (
          <>
            {isCustomClassesActivated && (
              <div className="w-full min-h-[50px] mb-2 rounded-md">
                <ClassSection
                  classes={defaultOrCustomClasses}
                  handleDeleteCustomClass={handleDeleteCustomClass}
                  handleAddCustomClass={async (newClassName: string) => {
                    handleAddCustomClass(
                      client as ClientType,
                      planIds,
                      newClassName,
                    );
                  }}
                  onSave={(editedClass: ClassType) => {
                    handleUpdateClass(editedClass);
                  }}
                  isCustomClassesActivated = {isCustomClassesActivated}
                />
              </div>
            )}
            <button
              className="flex items-center gap-2 outline outline-1 outline-gray-200 px-2 py-1 w-full justify-center rounded-sm bg-gray-100/20 hover:bg-gray-100/50"
              onClick={() => {
                setIsCustomClassesActivated(!isCustomClassesActivated);
              }}
            >
              {isCustomClassesActivated ? <IoMdEyeOff /> : <IoMdEye/>}
              {isCustomClassesActivated ? <p>Disable Classes</p> : <p>Enable Classes</p>}
            </button>
          </>
        )}
        </div>
        </div>

        <div className="w-4/5">
        <button
          onClick={() => setIsThirdOpen(!isThirdOpen)}
          className="w-full text-left py-2 px-4 font-semibold rounded-md"
        >
          <div className="font-bold text-xl">
            Plans
          </div>
        </button>
        {isThirdOpen && (
          <div className="w-full min-h-[50px] bg-gray-100 p-4 mb-4 rounded-md">
            <PlanSection
              plans={plans}
              classes={defaultOrCustomClasses}
              isCustomClassesActivated={isCustomClassesActivated}
              planSpecificClassInfo={planSpecificClassInfo}
              censusData={client?.census_data as CensusDataType}
              handleUpdateClassInfo={handleUpdateClass}
            />
          </div>
        )}

          </div>

      </div>
    </div>
    </div>
    </main>
  );
}
