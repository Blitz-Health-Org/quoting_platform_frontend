"use client";

import React, { useContext, useEffect, useState } from "react";
import { Subheader } from "../../components/comparison/Subheader";
import { ContributionCard } from "@/src/components/comparison/ContributionCard";
import "../../components/comparison/sum.css"; // import your custom styles
import Fullheader from "../../components/comparison/Fullheader";
import QuoteCard from "../../components/comparison/QuoteCard";
import Left from "../../components/comparison/Left";
import { ClientType } from "@/src/types/custom/Client";
import { supabase } from "@/src/supabase";
import { QuoteType } from "@/src/types/custom/Quote";
import { NonSystemField, quoteMetadataObject } from "@/src/types/metadata";
import { isFieldVisible } from "@/src/types/utils/isFieldVisible";
import { notFound, useSearchParams } from "next/navigation";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { FaTrash } from "react-icons/fa";
import { SnackbarAlert } from "../../components/ui/SnackbarAlert";
import { SocketContext } from "@/src/context/SocketContext";
import { v4 as uuid } from "uuid";
import ContributionPane from "@/src/components/comparison/ContributionPane";
import PlanCard from "@/src/components/comparison/PlanCard";

type ClassType = {
  name: string;
  data: Record<string, any>;
};

type QuotingPageProps = {
  client: ClientType;
};

export default function QuotingPage() {
  const [client, setClient] = useState<ClientType>();

  const { socket } = useContext(SocketContext);

  const searchParams = useSearchParams();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const clientId = searchParams.get("clientId");
    if (clientId) {
      fetchClientAndQuotes(clientId);
    }
  }, [searchParams]);

  // const handleEdit = () => {
  //   // Enable editing mode
  //   setEditStandardContributions(true);
  // };

  // const handleSave = () => {
  //   // Disable editing mode
  //   setEditStandardContributions(false);

  //   // Save the edited values to JSON
  //   const jsonResult = JSON.stringify(standardContributions);
  //   console.log(jsonResult);

  //   // You can save the JSON data to your desired location or state.
  //   // For example, you can send it to the server or store it in another state.
  // };

  const fetchClientAndQuotes = async (clientId: string) => {
    try {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (clientError) throw clientError;

      setClient(clientData);

    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally handle errors, such as setting an error state or showing a notification
    }
  };


  return (
    <div className="bg-gray-100 w-full h-screen">
      Hi
    </div>
  );
}
