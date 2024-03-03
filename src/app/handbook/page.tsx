"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import RenderedHandbook from "../../components/handbook/RenderedHandbook";
import { supabase } from "@/src/supabase";
import { ClientType } from "@/src/types/custom/Client";
import { redirect, useSearchParams } from "next/navigation";
import { Navbar } from "@/src/components/comparison/Navbar";

export default function QuotingPage() {
  const [displayPDF, setDisplayPDF] = useState(false);
  const [client, setClient] = useState<any>();
  const [plans, setPlans] = useState<any>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const clientId = searchParams.get("clientId");
    if (clientId) {
      fetchClient(clientId);
    } else {
      redirect("/404");
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
        console.log("error", clientError)
      }

      console.log(clientData)
      setClient(clientData);
      setPlans(clientData.connected_plans);

    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally handle errors, such as setting an error state or showing a notification
    }
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
      <Navbar selected="Handbook" />

  <div className="w-full flex-col pt-6 md:w-6/7">
    <div className="flex gap-3">
      {client?.connected_plans?.map((plan: any, index: any) => (
        <li key={index}>
          {plan?.name}
            <ul>
              <div className="outline outline-1 outline-gray-400 bg-slate-100 rounded-md p-2">
                {plan.selectedQuotes?.map((quote: any, quoteIndex: any) => (
                  <li key={quoteIndex}>Quote: {quote.name} - Plan ID: {plan.id}</li>
                ))}
              </div>
            </ul>
          </li>      
        ))}
      </div>

      <Button onClick={() => setDisplayPDF(true)}>Render Handbook</Button>
      </div>
    </div>
  );
}
