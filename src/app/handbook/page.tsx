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
import { Collapse } from '@mui/material';
import { SlArrowUp } from "react-icons/sl";
import { SlArrowDown } from "react-icons/sl";
import Image from "next/image";

type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

type Plans = {
  id: number;
  name: string;
  selectedQuotes: QuoteTypeWithCheckbox[];
}[];

export default function QuotingPage() {
  const [displayPDF, setDisplayPDF] = useState(false);
  const [client, setClient] = useState<ClientType>();
  const [plans, setPlans] = useState<Plans | undefined>(undefined);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [displayPlans, setDisplayPlans] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

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
    const selectedPlan = plans?.find(plan => plan.id === selectedPlanId);
    const quotes = selectedPlan?.selectedQuotes || [];
    const updatedDummyData = quotes.reduce((acc: any, quote: any) => {
      Object.keys(acc).forEach(key => {
        if (quote.data[key] !== undefined) {
          acc[key] = quote.data[key];
        }
      });
      return acc;
    }, {...dummyData});

    console.log("sup", updatedDummyData)
    console.log("sup", dummyData)

    return updatedDummyData;
  };  

  const dummyData = {
    planName: 0,
    deductible: 0,
    coinsurance: 0,
    oopMax: 0,
    PCPcopay: 0,
    specialistCopay: 0,
    ERcopay: 0,
    pharmacyCopay: 0,
    inpatientCopay: 0,
    urgentCareCopay: 0,
    prescriptionDeductible: 0,
    eeRate: 0,
    esRate: 0,
    ecRate: 0,
    efRate: 0,
  };

  if (displayPDF) {
    return (
      <div className="bg-gray-100 w-full h-screen">
        <Button onClick={() => setDisplayPDF(false)}>Back</Button>
        <RenderedHandbook {...dummyData} />
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 w-full h-screen">
      <Navbar selected="Handbooks" />

      <div className="w-full flex-col pt-6 pl-6 pr-4 pb-6 md:w-6/7 overflow-hidden">
      <div className="flex items-center text-sm md:text-base mb-4">
            <button
              className="flex items-center"
              onClick={() => router.push('/')}
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
        <div className="p-6 rounded-md w-full flex-col overflow-x-hidden h-full pb-12 overflow-y-scroll bg-white outline outline-1 outline-gray-200">
        <button
          onClick={() => setDisplayPlans(!displayPlans)}
          className="ml-0.5 mr-0.5 bg-gray-100/50 outline outline-1 outline-gray-300 w-full rounded-md h-10 mb-2"
        >
          {displayPlans ? 
            <div className="pl-4 pr-4 flex items-center justify-between">
              Medical
              <SlArrowUp/>
            </div> 
            : 
            <div className="pl-4 pr-4 flex items-center justify-between">
              Medical
              <SlArrowDown/>
            </div>
          }
        </button>
        <Collapse in={displayPlans}>
          <div className="flex gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pl-0.5 py-0.5">
          {client?.connected_plans?.map((plan: any, index: any) => (
          <div
            key={index}
            className={`col-span-1 outline ${selectedPlanId === plan.id ? 'flex-col outline-blue-400 bg-gray-100/80 shadow' : 'outline-gray-300 bg-gray-100/50'} hover: bg-gray-100/80 rounded-md p-2 max-h-32 overflow-auto hover:cursor-pointer`}
            onClick={() => handlePlanClick(plan.id)}
          >
            <p className="font-semibold">{plan?.name}</p>
                <div>
                  {plan.selectedQuotes?.map((quote: any, index: any) => (
                    <p className="flex" key={index}>
                      {quote.logo_url && (
                        <Image
                          src={quote.logo_url}
                          alt={`Logo for ${quote[index.key]}`}
                          width={20}
                          height={20}
                          className="mr-2 rounded-md"
                        />
                      )}
                      {quote.data["plan_id"] || quote.data["plan_name"]}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Collapse>

        <button
          onClick={() => combineSelectedQuotesData()}
          className="mt-2 rounded-md px-2 py-1 outline outline-1 outline-gray-300 bg-slate-100/50"
        >
          Render Handbook
        </button>
      </div>
    </div>
    </div>
  );
}
