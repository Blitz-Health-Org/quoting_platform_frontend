"use client";

import React, { useContext, useEffect, useState } from "react";
import { Subheader } from "../../components/comparison/Subheader";
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
import { GroupCard } from "@/src/components/comparison/GroupCard";
import { SnackBarContext } from "@/src/context/SnackBarContext";
import { QuoteSchemaContext } from "@/src/context/QuoteSchemaContext";
import { ClientContextProvider } from "@/src/context/ClientContext";
import { PlanSpecificClassInfoType } from "@/src/types/custom/Class";
import { getClasses } from "../cost/utils/getClasses";
import { ClassType } from "@/src/types/custom/Class";
import { PlanGroupType } from "@/src/types/custom/PlanGroup";

type QuotingPageProps = {
  client: ClientType;
};

export default function QuotingPage() {
  const [client, setClient] = useState<ClientType>();
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [planSpecificClassInfo, setPlanSpecificClassInfo] =
    useState<PlanSpecificClassInfoType>([]);
  const [plans, setPlans] = useState<any>([]);

  const { fetchAndSetClasses } = getClasses(
    setClasses,
    setPlanSpecificClassInfo,
  );

  const [standardContribution, setStandardContribution] = useState<any>({
    name: "Standard Contribution",
    data: {
      employee: {
        percent: 50,
        employees:
          plans?.[0]?.["selectedQuotes"]?.[0]?.["data"]?.["employee_num"] ??
          null,
      },
      family: {
        percent: 50,
        employees:
          plans?.[0]?.["selectedQuotes"]?.[0]?.["data"]?.["family_num"] ?? null,
      },
      child: {
        percent: 50,
        employees:
          plans?.[0]?.["selectedQuotes"]?.[0]?.["data"]?.["child)num"] ?? null,
      },
      spouse: {
        percent: 50,
        employees:
          plans?.[0]?.["selectedQuotes"]?.[0]?.["data"]?.["spouse_num"] ?? null,
      },
    },
  });

  const searchParams = useSearchParams();

  const sharingId = searchParams.get("sharing");
  const coverage_type = searchParams.get("type") ?? "medical";

  const { quoteSchema } = useContext(QuoteSchemaContext);

  const coverageSpecificSchema = quoteSchema[coverage_type];

  const { setSnackbar } = useContext(SnackBarContext);

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
    console.log("client id", clientId);
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

      if (clientData?.connected_plans) {
        // Find the index of the current plan
        const currentPlanIndex = clientData.connected_plans.findIndex(
          (plan: any) => plan.isCurrentPlan === true,
        );

        // If a current plan is found and it's not the first element, move it to the front
        let newPlans;
        if (currentPlanIndex > 0) {
          newPlans = [...clientData.connected_plans];
          const [currentPlan] = newPlans.splice(currentPlanIndex, 1);
          newPlans.unshift(currentPlan);
          setPlans(newPlans);
        } else {
          console.log("should fire", clientData);
          // Else just set the plans normally
          newPlans = clientData.connected_plans;
          setPlans(newPlans);
        }

        newPlans = newPlans.reduce(
          (acc: QuoteType[], newPlan: PlanGroupType) => {
            // Append each selectedQuotes list to the accumulator
            return acc.concat(newPlan.selectedQuotes);
          },
          [],
        );

        fetchAndSetClasses(
          clientData,
          newPlans.map((plan: any) => plan.id),
        );
      }
      const scopedPlans = clientData.connected_plans;

      setStandardContribution({
        name: "Standard Contribution",
        data: {
          employee: {
            percent: 50,
            employees:
              scopedPlans?.[0]?.["selectedQuotes"]?.[0]?.["data"]?.[
                "employee_num"
              ] ?? null,
          },
          family: {
            percent: 50,
            employees:
              scopedPlans?.[0]?.["selectedQuotes"]?.[0]?.["data"]?.[
                "family_num"
              ] ?? null,
          },
          child: {
            percent: 50,
            employees:
              scopedPlans?.[0]?.["selectedQuotes"]?.[0]?.["data"]?.[
                "child_num"
              ] ?? null,
          },
          spouse: {
            percent: 50,
            employees:
              scopedPlans?.[0]?.["selectedQuotes"]?.[0]?.["data"]?.[
                "spouse_num"
              ] ?? null,
          },
        },
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  let censusData;
  if (plans.length == 0) {
    censusData = {
      employee: null,
      spouse: null,
      child: null,
      family: null,
    };
  } else {
    censusData = {
      employee: {
        percent: 100,
        employees:
          plans?.[0]?.["selectedQuotes"]?.[0]?.["data"]?.["employee_num"] ?? 5,
      },
      family: {
        percent: 100,
        employees:
          plans?.[0]?.["selectedQuotes"]?.[0]?.["data"]?.["family_num"] ?? 5,
      },
      child: {
        percent: 100,
        employees:
          plans?.[0]?.["selectedQuotes"]?.[0]?.["data"]?.["child_num"] ?? 5,
      },
      spouse: {
        percent: 100,
        employees:
          plans?.[0]?.["selectedQuotes"]?.[0]?.["data"]?.["spouse_num"] ?? 5,
      },
    };
  }

  if (!classes || !planSpecificClassInfo) {
    return <></>;
  }

  return (
    <ClientContextProvider
      value={{
        client: client as ClientType,
        sharingId,
        hiddenComparisonFields: (client as any).hidden_comparison_fields,
      }}
    >
      <div className="bg-gray-100 w-full h-screen">
        <div className="w-full overflow-x-hidden h-full bg-gray-100 flex flex-col">
          <Fullheader clientName={client?.name || "N/A"} />
          <div className="bg-gray-100 border border-gray-200 border-b-0 px-6 py-2 mt-2 flex flex-col h-full">
            {!sharingId ? (
              <Subheader
                client={client}
                setStandardContribution={setStandardContribution}
                isPaneOpen={paneState.isPaneOpen}
                onPaneToggle={handlePaneToggle}
                copyUrlToClipboard={copyUrlToClipboard}
                handleDownloadCSV={handleDownloadCSV}
                plans={plans}
              />
            ) : (
              <div className="h-12 mt-2"></div>
            )}

            <div className="p-0.5 flex-grow w-full">
              <div className="h-full flex gap-2 overflow-auto">
                <div className="border border-gray-300 h-fit border-l-0 border-t-0 border-b-0 rounded-t-md">
                  <HeaderCard fieldObject={coverageSpecificSchema} />
                </div>
                {plans.length > 0 ? (
                  plans.map((plan: any) => (
                    <GroupCard
                      key={plan.key}
                      plan={plan}
                      fieldObject={coverageSpecificSchema}
                      classes={classes}
                      standardContribution={standardContribution}
                      clientId={client?.id}
                      planSpecificClassInfo={planSpecificClassInfo}
                      fetchClientAndQuotes={fetchClientAndQuotes}
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
        </div>
      </div>
      <ContributionPane
        paneState={paneState}
        setPaneState={setPaneState}
        classes={classes}
        setClasses={setClasses}
        client={client}
        censusData={censusData}
        standardContribution={standardContribution}
        setStandardContribution={setStandardContribution}
      />
    </ClientContextProvider>
  );
}
