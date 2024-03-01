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
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [plans, setPlans] = useState<any>(null);
  const [standardContribution, setStandardContribution] = useState<any>({
    name: "Standard Contribution",
    data: {
      employee: { percent: 100, employees: 50 },
      family: { percent: 100, employees: 50 },
      child: { percent: 100, employees: 50 },
      spouse: { percent: 100, employees: 50 },
    },
  });

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (socket && client) {
      // Connect to the Socket.IO server
      // Listen for 'task_complete' events
      socket.on("sub_task_complete", async (data) => {
        console.log("what the hell socket on");
        const { data: quotesData, error: quotesError } = await supabase
          .from("quotes")
          .select("*")
          .eq("client_id", client.id);

        if (quotesData) {
          const orderedByAlphaData = quotesData.sort((rowA, rowB) => {
            if (rowA.name < rowB.name) return -1;
            if (rowA.name > rowB.name) return 1;
            return 0;
          });

          setQuotes(orderedByAlphaData);
        }
      });

      // Listen for 'task_status' events
      socket.on("task_status", (data) => {
        console.log("Task Status:", data);
      });

      return () => {
        socket.off("sub_task_complete");
        socket.off("task_status");
        socket.close();
      };
    }
  }, []);

  const searchParams = useSearchParams();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
    const quoteIds = searchParams.get("quoteIds");

    if (clientId && quoteIds) {
      // Convert quoteIds back into an array of IDs
      const ids = quoteIds.split(",").map((id) => id.trim());
      fetchClientAndQuotes(clientId, ids);
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

  const fetchClientAndQuotes = async (clientId: string, quoteIds: string[]) => {
    try {
        const { data: clientData, error: clientError } = await supabase
            .from("clients")
            .select("*")
            .eq("id", clientId)
            .single();

        if (clientError) throw clientError;

        setClient(clientData);

        // Fetch connected plan for the specific client
        const { data: planData, error: planError } = await supabase
            .from("clients")
            .select("connected_plans")
            .eq("id", clientId)
            .single();

        if (planError) throw planError;
        setPlans(planData?.connected_plans);

        if (clientData?.classes_contributions) {
            console.log("helllo????");
            setClasses(clientData.classes_contributions as any);
        }

        const { data: quotesData, error: quotesError } = await supabase
            .from("quotes")
            .select("*")
            .in("id", quoteIds);

        if (quotesError) throw quotesError;

        const orderedByAlphaData = quotesData.sort((rowA, rowB) => {
            if (rowA.name < rowB.name) return -1;
            if (rowA.name > rowB.name) return 1;
            return 0;
        });

        setQuotes(orderedByAlphaData);
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

    // Generate a query_id to store in supabase
    const queryId = uuid();
    const { error } = await supabase
      .from("links")
      .insert([{ query_id: queryId, url: url }])
      .select();
    console.log(queryId);
    if (error) {
      console.error("Failed to insert URL to supabase", error);
      setSnackbar({
        open: true,
        message: "Failed to copy URL to clipboard",
        severity: "error",
      });
    }

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
    <div className="bg-gray-100 w-full h-screen">
      <div className="w-full overflow-x-hidden h-fit bg-gray-100">
        <Fullheader clientName={client?.name || "N/A"} />
        <div className="bg-gray-100 border border-gray-200 border-b-0 px-6 py-2">
          <Subheader
            clientId={client?.id || 0}
            isPaneOpen={paneState.isPaneOpen}
            onPaneToggle={handlePaneToggle}
            copyUrlToClipboard={copyUrlToClipboard}
            handleDownloadCSV={handleDownloadCSV}
            quotesLength={quotes.length}
          />

          <div className="p-0.5 flex w-full h-full overflow-auto gap-2">
            <Left
              nonObjectVisibleQuoteFields={nonObjectVisibleQuoteFields}
              objectVisibleQuoteFields={objectVisibleQuoteFields}
            />
            {plans.length > 0 ? (
              plans.map((plan: any) => (
                <PlanCard
                  plan={plan}
                  nonObjectVisibleQuoteFields={nonObjectVisibleQuoteFields}
                  objectVisibleQuoteFields={objectVisibleQuoteFields}
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

        <ContributionPane
          paneState={paneState}
          setPaneState={setPaneState}
          classes={classes}
          setClasses={setClasses}
          client={client}
          standardContribution={standardContribution}
          setStandardContribution={setStandardContribution}
        />

        <SnackbarAlert
          openSnackbarShare={snackbar.open}
          setOpenSnackbarShare={setSnackbar}
          snackbar={{
            open: snackbar.open,
            message: snackbar.message,
            severity: snackbar.severity,
          }}
        />
      </div>
    </div>
  );
}
