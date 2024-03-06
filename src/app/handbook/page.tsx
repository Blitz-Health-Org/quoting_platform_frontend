"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import RenderedHandbook from "../../components/handbook/RenderedHandbook";
import { supabase } from "@/src/supabase";
import { ClientType } from "@/src/types/custom/Client";
import { redirect, useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/src/components/comparison/Navbar";
import { QuoteType } from "@/src/types/custom/Quote";
import { IoMdArrowBack } from "react-icons/io";
import { IconBuilding } from "@tabler/icons-react";
import { Collapse } from "@mui/material";
import { SlArrowUp } from "react-icons/sl";
import { SlArrowDown } from "react-icons/sl";
import Image from "next/image";
import { RiAiGenerate } from "react-icons/ri";

type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };
type DentalQuoteDetailsExt = DentalQuoteDetails & {
  [key: string]: any; // Use cautiously; it undermines TypeScript's type safety!
};

type Plans = {
  id: number;
  name: string;
  selectedQuotes: QuoteTypeWithCheckbox[];
}[];

type MedicalQuoteDetails = {
  plan_name: string
  plan_id: string
  deductible: string
  total_employer_cost: string
  out_of_pocket_max: string
  copay_coinsurance: string
  monthly_premium: string
  employee_rate: string
  office_copay: string
  spouse_rate: string
  family_rate: string
};

const medicalKeyDisplayNames: { [key: string]: string } = {
  plan_name: "Plan Name",
  plan_id: "Plan ID",
  deductible: "Deductible",
  total_employer_cost: "Total Employer Cost",
  out_of_pocket_max: "Out of Pocket Max",
  copay_coinsurance: "Copay Coinsurance",
  monthly_premium: "Monthly Premium",
  employee_rate: "Employee Rate",
  office_copay: "Office Copay",
  spouse_rate: "Spouse Rate",
  family_rate: "Family Rate",
};

const dentalKeyDisplayNames: { [key: string]: string } = {
  plan_name: "Plan Name",
  plan_id: "Plan ID",
  deductible: "Deductible",
  coinsurance: "Coinsurance",
  employee_only_rate: "Employee Only Rate",
  employee_spouse_rate: "Employee Spouse Rate",
  employee_child_rate: "Employee Child Rate",
  employee_family_rate: "Employee Family Rate",
  pcp_copay: "PCP Copay",
  specialist_copay: "Specialist Copay",
  er_copay: "ER Copay",
  pharmacy_copay: "Pharmacy Copay",
  inpatient_copay: "Inpatient Copay",
  urgent_care_copay: "Urgent Care Copay",
  prescription_deductible: "Prescription Deductible",
  total_cost: "Total Cost",
  out_of_pocket_max: "Out of Pocket Max",
};

type DentalQuoteDetails = {
  plan_name: string;
  plan_id: string;
  deductible: string;
  coinsurance: string;
  employee_only_rate: string;
  employee_spouse_rate: string;
  employee_child_rate: string;
  employee_family_rate: string;
  pcp_copay: string;
  specialist_copay: string;
  er_copay: string;
  pharmacy_copay: string;
  inpatient_copay: string;
  urgent_care_copay: string;
  prescription_deductible: string;
  total_cost: string;
  out_of_pocket_max: string;
};

export default function QuotingPage() {
  const [displayPDF, setDisplayPDF] = useState(false);
  const [client, setClient] = useState<ClientType>();
  const [plans, setPlans] = useState<Plans | undefined>(undefined);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [displayPlans, setDisplayPlans] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [quoteData, setQuoteData] = useState<MedicalQuoteDetails[]>();
  const [editableQuotes, setEditableQuotes] = useState<{
    [key: string]: { [dataKey: string]: string };
  }>({});
  const [displayDentalPlans, setDisplayDentalPlans] = useState(false);
  const [dentalQuoteData, setDentalQuoteData] = useState<DentalQuoteDetails[]>(
    [],
  );

  const handleInputChange = (
    planIndex: number,
    quoteIndex: number,
    key: string,
    value: string,
  ) => {
    const newState = { ...editableQuotes };
    const indexKey = `${planIndex}-${quoteIndex}`;
    if (!newState[indexKey]) newState[indexKey] = {};
    newState[indexKey][key] = value;
    setEditableQuotes(newState);
  };

  const handlePlanClick = (planId: number) => {
    if (selectedPlanId === planId) {
      setSelectedPlanId(null); // Deselect if the same plan is clicked again
    } else {
      setSelectedPlanId(planId); // Select the clicked plan
    }
  };

  useEffect(() => {
    const clientId = searchParams.get("clientId");
    if (clientId) {
      fetchClient(clientId);
    }
  }, [searchParams]);

  function selectQuotes() {
    router.push(`/select?clientId=${client?.id}`);
    return;
  }

  const fetchClient = async (clientId: string) => {
    try {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (clientError) {
        alert("No client found");
        redirect("/404");
      }

      setClient(clientData);
      setPlans(clientData.connected_plans);

      console.log(
        clientData.connected_plans[0].selectedQuotes[0].data["plan_id"] ||
          clientData.connected_plans[0].selectedQuotes[0].data["plan_name"],
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally handle errors, such as setting an error state or showing a notification
    }
  };

  const combineSelectedQuotesData = () => {
    const selectedPlan = plans?.find((plan) => plan.id === selectedPlanId);
    if (!selectedPlan) return;

    const updatedQuoteData = selectedPlan.selectedQuotes.map(
      (quote, quoteIndex) => {
        const planIndex = plans?.indexOf(selectedPlan);
        // Assuming plans is an array and contains selectedPlan

        // Use type assertion here to assure TypeScript that editedData will be an object.
        const editedData = (editableQuotes[`${planIndex}-${quoteIndex}`] ||
          {}) as { [key: string]: any };

        // Also ensure quote.data is always treated as an object with a type assertion
        const quoteData = (quote.data || {}) as { [key: string]: any };

        return { ...quoteData, ...editedData };
      },
    );

    // Assuming setQuoteData expects updatedQuoteData to be of a specific type
    setQuoteData(updatedQuoteData as any); // Adjust the 'any' type to match the expected type of setQuoteData
    console.log("Updated Data", updatedQuoteData);
  };

  const medicalDummyData = {
    plan_name: "Missing",
    plan_id: "Missing",
    deductible: "Missing",
    total_employer_cost: "Missing",
    out_of_pocket_max: "Missing",
    copay_coinsurance: "Missing",
    monthly_premium: "Missing",
    employee_rate: "Missing",
    office_copay: "Missing",
    spouse_rate: "Missing",
    family_rate: "Missing",
  };

  const dentalDummyData = {
    plan_name: "Missing",
    plan_id: "Missing",
    deductible: "Missing",
    coinsurance: "Missing",
    employee_only_rate: "Missing",
    employee_spouse_rate: "Missing",
    employee_child_rate: "Missing",
    employee_family_rate: "Missing",
    pcp_copay: "Missing",
    specialist_copay: "Missing",
    er_copay: "Missing",
    pharmacy_copay: "Missing",
    inpatient_copay: "Missing",
    urgent_care_copay: "Missing",
    prescription_deductible: "Missing",
    total_cost: "Missing",
    out_of_pocket_max: "Missing",
  };

  return (
    <div className="flex bg-gray-100 w-full h-screen">
      <Navbar selected="Handbooks" />

      <div className="w-full flex-col pt-6 pl-6 pr-4 pb-6 md:w-6/7 overflow-hidden">
        <div className="flex justify-between w-full">
          <div className="flex items-center text-sm md:text-base mb-4">
            <button
              className="flex items-center"
              onClick={() => router.push("/")}
            >
              <IoMdArrowBack />
              <p className="ml-2 mr-1">Clients / </p>
            </button>
            <IconBuilding className="h-5 w-5 mr-2" />
            <p className="mr-1">{client?.name || "Client"}</p>
            <p className="mr-2">/ Handbook</p>
            {/* <p className="mr-1">/ Quotes</p>
        <p className="mr-1 text-gray-400 text-xs">•</p>
        <p className="text-gray-400">({quotes.length})</p> */}
          </div>
          <button
            onClick={async () => {
              combineSelectedQuotesData();
              setDisplayPDF(true);
            }}
            className="items-center justify-center gap-2 flex ml-1 mb-2 rounded-md px-2 py-1 outline outline-1 outline-gray-300 hover:bg-gray-100 hover:outline-gray-400/90"
          >
            <RiAiGenerate />
            <p>Render Handbook</p>
          </button>
        </div>
        <div className="p-6 rounded-md w-full flex-col overflow-x-hidden h-full pb-12 overflow-y-scroll bg-white outline outline-1 outline-gray-200">
          <button
            onClick={() => setDisplayPlans(!displayPlans)}
            className="ml-0.5 mr-0.5 bg-gray-100/50 outline outline-1 outline-gray-300 w-full rounded-md h-10 mb-2"
          >
            <div className="pl-4 pr-4 flex items-center justify-between">
              <div className="flex">
                <input
                  type="checkbox"
                  className="mr-2"
                  onClick={(e) => e.stopPropagation()}
                />
                Medical
              </div>
              {displayPlans ? <SlArrowUp /> : <SlArrowDown />}
            </div>
          </button>
          <Collapse
            in={displayPlans}
            className={`bg-gray-100/50 border border-1 border-gray-300 rounded-md px-0.5`}
          >
            <div className="w-full h-full p-4">
              {client?.connected_plans ? (
                <div>
                  <div className="flex gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {client?.connected_plans?.map((plan: any, index: any) => (
                      <div
                        key={index}
                        className={`col-span-1 outline ${selectedPlanId === plan.id ? "flex-col outline-blue-400 bg-gray-100/80 shadow" : "outline-gray-300 bg-gray-100/50"} hover:bg-gray-100/80 rounded-md p-2 max-h-32 overflow-auto hover:cursor-pointer`}
                        onClick={() => handlePlanClick(plan.id)}
                      >
                        <p className="font-semibold p-1">{plan?.name}</p>
                        <div>
                          {plan.selectedQuotes?.map(
                            (quote: any, index: any) => (
                              <p className="flex p-1" key={index}>
                                {quote.logo_url && (
                                  <Image
                                    src={quote.logo_url}
                                    alt={`Logo for ${quote[index.key]}`}
                                    width={25}
                                    height={10}
                                    className="mr-2 rounded-md"
                                  />
                                )}
                                {quote.data["plan_id"] ||
                                  quote.data["plan_name"]}
                              </p>
                            ),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full overflow-auto pr-1 pl-1 flex">
                    {selectedPlanId && (
                      <div className="flex flex-col gap-4 mt-4 mr-4 mb-1">
                        <p className="font-semibold mt-8"></p>
                        {Object.entries(medicalDummyData).map(
                          ([key, value]) => (
                            <p className="font-semibold truncate" key={key}>
                              {medicalKeyDisplayNames[key] || key}
                            </p>
                          ),
                        )}
                      </div>
                    )}
                    {client?.connected_plans
                      ?.filter((plan: any) => plan?.id === selectedPlanId)
                      .map((plan: any, planIndex: any) => (
                        <div key={planIndex} className="flex gap-4 mt-4">
                          {plan.selectedQuotes?.map(
                            (quote: any, quoteIndex: any) => (
                              <div
                                key={`${planIndex}-${quote.id}`}
                                className="mt-2 flex flex-col gap-4"
                              >
                                <div className="font-semibold">
                                  Quote {quoteIndex + 1}
                                </div>
                                {Object.entries(medicalDummyData).map(
                                  ([key, value]) => (
                                    <input
                                      className="px-2 outline outline-1 outline-gray-300"
                                      key={key}
                                      defaultValue={quote.data[key] || value}
                                      onChange={(e) =>
                                        handleInputChange(
                                          planIndex,
                                          quoteIndex,
                                          key,
                                          e.target.value,
                                        )
                                      }
                                    ></input>
                                  ),
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="flex-col">
                  <p>No Plans Created</p>
                  <button
                    onClick={selectQuotes}
                    className="px-2 py-1 hover:bg-gray-100 outline outline-1 outline-gray-300 mt-2 rounded-sm"
                  >
                    Create a Plan
                  </button>
                </div>
              )}
            </div>
          </Collapse>
          <button
            onClick={() => setDisplayDentalPlans(!displayDentalPlans)}
            className="ml-0.5 mr-0.5 bg-gray-100/50 outline outline-1 outline-gray-300 w-full rounded-md h-10 mt-2 mb-2"
          >
            <div className="pl-4 pr-4 flex items-center justify-between">
              <div className="flex">
                <input
                  type="checkbox"
                  className="mr-2"
                  onClick={(e) => e.stopPropagation()}
                />
                Dental
              </div>
              {displayDentalPlans ? <SlArrowUp /> : <SlArrowDown />}
            </div>
          </button>

          <Collapse
            in={displayDentalPlans}
            className={`bg-gray-100/50 border border-1 border-gray-300 rounded-md`}
          >
            <div className="flex w-full flex-wrap gap-4 p-4">
              {Object.entries(dentalDummyData).map(([key, value]) => (
                <div key={key} className="flex-col col-span-1 w-1/5">
                  <p className="truncate">{dentalKeyDisplayNames[key]}</p>
                  <input
                    className="w-full px-2 outline outline-1 outline-gray-300"
                    key={key}
                    defaultValue={value}
                    // Save each input change into the dentalQuoteData state
                    onChange={(e) => {
                      // console.log(dentalQuoteData)
                      const newDentalData = [...dentalQuoteData];
                      if (newDentalData[0] === undefined) {
                        newDentalData[0] = {
                          ...dentalDummyData,
                        } as DentalQuoteDetailsExt; // Initialize with dummy data structure if empty
                      }
                      (newDentalData[0] as DentalQuoteDetailsExt)[key] =
                        e.target.value; // Cast here for setting value
                      setDentalQuoteData(newDentalData as DentalQuoteDetails[]); // Assuming your state expects an array of DentalQuoteDetails
                    }}
                  ></input>
                </div>
              ))}
            </div>
          </Collapse>

          {displayPDF && (
            <div className="bg-gray-100 w-full h-screen mt-2">
              <RenderedHandbook
                quoteData={quoteData}
                dentalQuoteData={dentalQuoteData}
                clientName={client?.name}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
