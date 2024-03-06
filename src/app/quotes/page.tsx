"use client";

import React, { useContext, useEffect, useState } from "react";
import { Subheader } from "../../components/comparison/Subheader";
import { ContributionCard } from "@/src/components/comparison/ContributionCard";
import "../../components/comparison/sum.css"; // import your custom styles
import Fullheader from "../../components/comparison/Fullheader";
import { HeaderCard } from "../../components/comparison/HeaderCard";
import { ClientType } from "@/src/types/custom/Client";
import { supabase } from "@/src/supabase";
import { QuoteType } from "@/src/types/custom/Quote";
import { NonSystemField, quoteMetadataObject } from "@/src/types/metadata";
import { isFieldVisible } from "@/src/types/utils/isFieldVisible";
import { notFound, redirect, useSearchParams } from "next/navigation";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { FaTrash } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import ContributionPane from "@/src/components/comparison/ContributionPane";
import { PlanCard } from "@/src/components/comparison/PlanCard";
import { SnackBarContext } from "@/src/context/SnackBarContext";
import { QuoteSchemaContext } from "@/src/context/QuoteSchemaContext";
import { ClientContext } from "@/src/context/ClientContext";

type ClassType = {
  name: string;
  data: Record<string, any>;
};

type QuotingPageProps = {
  client: ClientType;
};

export default function QuotingPage() {
  const [client, setClient] = useState<ClientType>();
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [plans, setPlans] = useState<any>([]);
  const [standardContribution, setStandardContribution] = useState<any>({
    name: "Standard Contribution",
    data: {
      employee: { percent: 100, employees: 50 },
      family: { percent: 100, employees: 50 },
      child: { percent: 100, employees: 50 },
      spouse: { percent: 100, employees: 50 },
    },
  });

  console.log("standard contribution", standardContribution);
  const { quoteSchema } = useContext(QuoteSchemaContext);
  const { setSnackbar } = useContext(SnackBarContext);

  const searchParams = useSearchParams();

  const handleDownloadCSV = (index: any) => {
    setSnackbar({
      open: true,
      message: "This feature is coming soon!",
      severity: "info",
    });
  };

  useEffect(() => {
    // Attach resize event listener for future adjustments (if needed)
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      // Remove event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const determineInitialWidth = () => {
    if (typeof window !== "undefined") {
      // Set initial width based on screen size
      if (window.innerWidth <= 368) {
        return "75%";
      } else if (window.innerWidth <= 624) {
        return "65%";
      } else if (window.innerWidth <= 904) {
        return "55%";
      } else if (window.innerWidth <= 1224) {
        return "40%";
      } else if (window.innerWidth <= 1424) {
        return "32.5%";
      } else {
        return "25%";
      }
    }
  };

  const [paneState, setPaneState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
    initialPaneWidth: determineInitialWidth(), // Set initial width based on screen size
    paneWidth: determineInitialWidth(),
  });

  const handleResize = () => {
    if (typeof window !== "undefined") {
      let newWidth: any;

      if (window.innerWidth <= 368) {
        newWidth = "75%";
      } else if (window.innerWidth <= 624) {
        newWidth = "65%";
      } else if (window.innerWidth <= 904) {
        newWidth = "55%";
      } else if (window.innerWidth <= 1224) {
        newWidth = "40%";
      } else if (window.innerWidth <= 1424) {
        newWidth = "32.5%";
      } else {
        newWidth = "25%";
      }

      setPaneState((prevState) => ({ ...prevState, paneWidth: newWidth }));
    }
  };

  const handlePaneToggle = (newState: any) => {
    setPaneState((prevState) => ({ ...prevState, isPaneOpen: newState }));
  };

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

      if (clientError) {
        alert("No client found");
        redirect("/404");
      }

      setClient(clientData);

      setPlans(clientData.connected_plans);

      if (clientData?.classes_contributions) {
        console.log("helllo????");
        setClasses(clientData.classes_contributions as any);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally handle errors, such as setting an error state or showing a notification
    }
  };

  const visibleQuoteFields = Object.values(quoteMetadataObject).filter((val) =>
    isFieldVisible(val),
  ) as NonSystemField[];

  const nonObjectVisibleQuoteFields = visibleQuoteFields.filter(
    (val) => val.type !== "jsonb",
  );

  const objectVisibleQuoteFields = visibleQuoteFields.filter(
    (val) => val.type == "jsonb",
  );

  if (loading) {
    return <></>;
  }

  const copyUrlToClipboard = async () => {
    // Use window.location.href to get the current URL
    const url = window.location.href;

    // Check if query_id exists in supabase
    let queryId = "";
    const { data, error } = await supabase
      .from("clients")
      .select()
      .eq("id", client?.id);
    if (error) {
      console.error("Failed to fetch client data", error);
    } else if (data[0].sharing_id) {
      queryId = data[0].sharing_id;
    } else {
      queryId = uuid();
      const { error } = await supabase
        .from("clients")
        .update({ sharing_id: queryId, shared: true })
        .eq("id", client?.id);
      if (error) {
        console.error("Failed to insert URL to supabase", error);
      }
    }
    console.log(queryId);

    // Use the Clipboard API to write the text
    navigator.clipboard
      .writeText(url + "&sharing=" + queryId)
      .then(() => {
        // Optional: Display a message or call a function to indicate success
        setSnackbar({
          open: true,
          message: "Copied to clipboard!",
          severity: "success",
        });
      })
      .catch((err) => {
        // Optional: Handle any errors
        console.error("Failed to copy URL to clipboard", err);
        setSnackbar({
          open: true,
          message: "Failed to copy URL to clipboard",
          severity: "error",
        });
      });
  };

  return (
    <ClientContext.Provider value={client}>
      <div className="bg-gray-100 w-full h-screen">
        <div className="w-full overflow-x-hidden h-full bg-gray-100 flex flex-col">
          <Fullheader clientName={client?.name || "N/A"} />
          <div className="bg-gray-100 border border-gray-200 border-b-0 px-6 py-2 flex flex-col h-full">
            <Subheader
              client={client}
              setStandardContribution={setStandardContribution}
              isPaneOpen={paneState.isPaneOpen}
              onPaneToggle={handlePaneToggle}
              copyUrlToClipboard={copyUrlToClipboard}
              handleDownloadCSV={handleDownloadCSV}
              plansLength={plans.length}
            />

            <div className="p-0.5 flex-grow w-full">
              <div className="h-full flex gap-2 overflow-auto py-2">
                <HeaderCard fieldObject={quoteSchema} />
                {plans.length > 0 ? (
                  plans.map((plan: any) => (
                    <PlanCard
                      key={plan.key}
                      plan={plan}
                      fieldObject={quoteSchema}
                      classes={classes}
                      standardContribution={standardContribution}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center font-bold">
                    <div className="mt-5">No Quotes Available</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ContributionPane
            paneState={paneState}
            setPaneState={setPaneState}
            classes={classes}
            setClasses={setClasses}
            client={client}
            standardContribution={standardContribution}
            setStandardContribution={setStandardContribution}
          />
        </div>
      </div>
    </ClientContext.Provider>
  );
}
