"use client";

import { ClientType } from "@/src/types/custom/Client";
import { useRouter } from "next/navigation";
import { MdFileUpload } from "react-icons/md";
import { supabase } from "../../supabase";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { QuoteType } from "@/src/types/custom/Quote";
import { IconBuilding } from "@tabler/icons-react";
import SelectQuotesHeader from "../../components/comparison/SelectQuotesHeader";
import { AddQuote } from "@/src/components/client/modal/AddQuote";
import { Navbar } from "@/src/components/comparison/Navbar";
import SelectSidebar from "@/src/components/SelectSidebar";
import { SocketTasksContext } from "@/src/context/SocketContext";
import AddCurrentPlanModal from "@/src/components/comparison/AddCurrentPlanModal";
import { SnackBarContext } from "@/src/context/SnackBarContext";
import { QuotesTable } from "@/src/components/client/QuotesTable";
import TabHeader from "@/src/components/ui/TabHeader";
import { ActionBar } from "./ActionBar";
import { QuoteSchemaContext } from "@/src/context/QuoteSchemaContext";
import { includes } from "lodash";

export type TabOption =
  | "Updated"
  | "ACA"
  | "Dental"
  | "Vision"
  | "LTD"
  | "Group Term Life";

const TABS: TabOption[] = [
  "Updated",
  "ACA",
  "Dental",
  "Vision",
  "LTD",
  "Group Term Life",
];

export type CoverageTypeOption =
  | "medical"
  | "dental"
  | "vision"
  | "long_term_disability"
  | "group_term_life";

const TABS_TO_COVERAGE_TYPE_MAPPING: Record<TabOption, CoverageTypeOption> = {
  Updated: "medical",
  ACA: "medical",
  Dental: "dental",
  Vision: "vision",
  LTD: "long_term_disability",
  "Group Term Life": "group_term_life",
};

export type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

export default function SelectQuotes() {
  type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

  const [modalOpen, setModalOpen] = useState<string>("");

  const { quoteSchema } = useContext(QuoteSchemaContext);

  const displayedPlanAttributesByCoverageType: Record<string, string[]> = {
    ...Object.entries(quoteSchema).reduce(
      (acc: Record<string, string[]>, [coverageType, coverageTypeSchema]) => {
        // Assuming coverageTypeSchema has a structure similar to { properties: { ... } }
        // and you want to collect the labels of these properties:
        if (!coverageTypeSchema.properties) {
          return acc;
        }
        const labels = Object.entries(coverageTypeSchema.properties).map(
          ([_, propertySchema]) => (propertySchema as any).label,
        );
        return { ...acc, [coverageType]: labels };
      },
      {},
    ),
    medical: [
      "plan_id",
      "carrier",
      "deductible",
      "out_of_pocket_max",
      "employee_rate",
      "coinsurance",
      "total_employer_cost",
    ],
  };

  const {
    socketTasks: [socketTasks, setSocketTasks],
  } = useContext(SocketTasksContext);

  const fetchQuoteData = async (client: any) => {
    if (client) {
      const { data, error } = await supabase
        .from("quotes")
        .select()
        .eq("client_id", client.id);

      if (error) {
        alert("Error updating data");
        router.push("/404");
      } else {
        // Check if selected_quotes is not null

        setQuotes(data);
        setOriginalQuotes(data);

        if (client.connected_plans) {
          // Check if there is data for connected_plans
          setPlans((client.connected_plans as any) || []); // Update plans state
        }
      }
    }
  };

  const searchParams = useSearchParams();

  const [selectedClient, setSelectedClient] = useState<ClientType>(
    undefined as unknown as ClientType,
  );

  const { setSnackbar } = useContext(SnackBarContext);

  const [selectedQuotes, setSelectedQuotes] = useState<QuoteTypeWithCheckbox[]>(
    [],
  );

  const handleBusiness = () => {
    setSnackbar({
      open: true,
      message: "This feature is coming soon!",
      severity: "info",
    });
  };

  async function setCurrentPlan() {
    const currentPlan = plans.find((plan) => plan.isCurrentPlan);
    if (currentPlan) {
      const updatedPlans = plans.map((plan) =>
        plan.id === currentPlan.id
          ? {
              ...currentPlan,
              selectedQuotes: [
                ...currentPlan.selectedQuotes,
                ...selectedQuotes,
              ],
            }
          : plan,
      );
      const { success } = await updateConnectedPlans(updatedPlans);
      if (success) {
        setPlans(updatedPlans);
      } else {
        alert("Upload failed");
        return;
      }
      handleClearCheckboxes();
    } else {
      createNewPlanAndAddSelectedQuotes(true);
    }
  }

  const comparison_created_false = async () => {
    const { data, error } = await supabase
      .from("clients") // Replace 'your_table_name' with your actual table name
      .update({ comparison_created: false }) // 'plans' is the array to insert into the 'connected_plans' column
      .match({ id: selectedClient.id }); // Assuming 'selectedClient.id' is the primary key of the row you want to update

    if (error) {
      console.error("Error updating connected plans in Supabase:", error);
      return { success: false, error };
    }

    console.log("Connected plans updated successfully:", data);
    return { success: true, data };
  };

  const updateConnectedPlans = async (updatedPlans: any) => {
    if (updatedPlans.length === 0) {
      comparison_created_false();
    }
    const { data, error } = await supabase
      .from("clients") // Replace 'your_table_name' with your actual table name
      .update({ connected_plans: updatedPlans }) // 'plans' is the array to insert into the 'connected_plans' column
      .match({ id: selectedClient.id }); // Assuming 'selectedClient.id' is the primary key of the row you want to update
    if (error) {
      console.error("Error updating connected plans in Supabase:", error);
      return { success: false, error };
    }
    console.log("Connected plans updated successfully:", data);

    return { success: true, data };
  };

  const createNewPlanAndAddSelectedQuotes = (isCurrentPlan = false) => {
    console.log("running create new plan and add selected qutoes");
    const newPlan = {
      id: Date.now(),
      isCurrentPlan: false,
      name: `Option #${plans.length + 1}`,
      selectedQuotes: selectedQuotes,
    };
    setPlans([...plans, newPlan]);
    handleClearCheckboxes();
    setSnackbar({
      open: true,
      message: "Plan added! Make sure to save your changes.",
      severity: "success",
    });
  };

  async function deleteQuotes() {
    console.log("DELETE", quotes, selectedQuotes);
    setQuotes(
      quotes.filter(
        (quote) =>
          !selectedQuotes
            .map((selectedQuote) => selectedQuote.id)
            .includes(quote.id),
      ),
    );
    const { error } = await supabase
      .from("quotes")
      .delete()
      .in(
        "id",
        selectedQuotes.map((quote) => quote.id),
      );
    handleClearCheckboxes();
  }

  const selectQuotesFirst = () => {
    setSnackbar({
      open: true,
      message: "Select quotes to add them to a plan!",
      severity: "error",
    });
  };

  const [quotes, setQuotes] = useState<QuoteTypeWithCheckbox[]>([]);
  const [originalQuotes, setOriginalQuotes] = useState<QuoteTypeWithCheckbox[]>(
    [],
  );

  const [currentTab, setCurrentTab] = useState<string>("Updated");

  const coverageType = TABS_TO_COVERAGE_TYPE_MAPPING[currentTab as TabOption];
  const planAttributes = displayedPlanAttributesByCoverageType[coverageType];

  const [search, setSearch] = useState<string | undefined>();

  const [sortOption, setSortOption] = useState("deductible"); // Initial sorting optio
  const [sortOrder, setSortOrder] = useState("asc"); // Initial sorting order

  const [entryWidth, setEntryWidth] = useState(
    innerWidth / planAttributes.length,
  );

  const actionBarEntries = [
    {
      label: "Delete",
      onClick: deleteQuotes,
      //TODO: add icon here
    },
    {
      label: "Set as Current Plan Option",
      onClick: setCurrentPlan,
    },
    {
      label: "Add to New Option",
      onClick: createNewPlanAndAddSelectedQuotes,
    },
  ];

  useEffect(() => {
    // Update entryWidth when the screen size changes

    const handleResize = () => {
      setEntryWidth(innerWidth / planAttributes.length);
    };

    // Attach event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleCheckboxChange = (quoteId: number) => {
    setQuotes((prevQuotes) =>
      prevQuotes?.map((quote) =>
        quote.id === quoteId
          ? { ...quote, isSelected: !quote.isSelected }
          : quote,
      ),
    );

    // Update selectedQuotes state
    setSelectedQuotes((prevSelectedQuotes) => {
      const index = prevSelectedQuotes.findIndex(
        (quote) => quote.id === quoteId,
      );
      if (index !== -1) {
        // If quote is already selected, remove it
        return prevSelectedQuotes.filter((quote) => quote.id !== quoteId);
      } else {
        // If quote is not selected, add it
        return [
          ...prevSelectedQuotes,
          quotes.find((quote) => quote.id === quoteId)!,
        ];
      }
    });
  };

  const handleSort = (option: string | null) => {
    if (option === null) {
      setQuotes(originalQuotes);
      return;
    }

    // Perform the sorting
    //TODO: handle empty quotes
    const sortedQuotes = quotes.slice().sort((a, b) => {
      const valueA = parseValue((a.data as any)?.[option]);
      const valueB = parseValue((b.data as any)?.[option]);

      if (
        valueA === Number.POSITIVE_INFINITY &&
        valueB === Number.POSITIVE_INFINITY
      ) {
        return 0; // Both are "N/A", keep original order
      } else if (valueA === Number.POSITIVE_INFINITY) {
        return sortOrder === "asc" ? 1 : -1; // Put "N/A" at the end or beginning
      } else if (valueB === Number.POSITIVE_INFINITY) {
        return sortOrder === "asc" ? -1 : 1; // Put "N/A" at the end or beginning
      }

      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    });

    // Update the state with the sorted quotes
    setQuotes(sortedQuotes);
  };

  console.log("QUOTES", quotes);

  const router = useRouter();

  const fetchClients = useCallback(async (clientId: number) => {
    try {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();
      if (clientError) throw clientError;
      fetchQuoteData(clientData);
      setSelectedClient(clientData);

      return clientData;
    } catch (error) {
      console.error("Failed to fetch client and quotes", error);
    }
  }, []);

  function handleAddNewQuote(event: any) {
    event?.stopPropagation();
    setModalOpen("addNewQuote");
    return;
  }

  const handleClearCheckboxes = () => {
    setQuotes((prevQuotes) =>
      prevQuotes?.map((quote) => ({
        ...quote,
        isSelected: false,
      })),
    );
    setSelectedQuotes([]);
  };

  async function handleDeleteQuote() {
    const selectedQuoteIds =
      quotes?.filter((quote) => quote.isSelected).map((quote) => quote.id) ||
      [];

    const { error } = await supabase
      .from("quotes")
      .delete()
      .in("id", selectedQuoteIds);
    if (error) {
      alert("Failed to delete quotes");
      return;
    }

    // setQuotes()

    const clientId = selectedClient.id;

    const { data: insertData, error: insertError } = await supabase
      .from("clients") // Replace with your actual Supabase table name
      .upsert({ id: selectedClient.id, selected_quotes: selectedQuoteIds });

    if (insertError) {
      console.error("Error inserting row into Supabase table:", insertError);
      return { success: false };
    } else {
      router.push(
        `/quotes?clientId=${clientId}&type=${TABS_TO_COVERAGE_TYPE_MAPPING[currentTab as TabOption]}`,
      );

      return { success: true };
    }
  }

  if (selectedClient && socketTasks?.includes("fetch_quotes")) {
    fetchQuoteData(selectedClient);
    setSocketTasks(socketTasks?.filter((task) => task !== "fetch_quotes"));
  }

  const [plans, setPlans] = useState<
    Array<{
      id: number;
      name: string;
      isCurrentPlan: boolean;
      selectedQuotes: QuoteTypeWithCheckbox[];
    }>
  >([]);
  const [newPlanName, setNewPlanName] = useState("");

  const handleAddQuotesToPlan = (planId: number) => {
    if (selectedQuotes.length === 0) {
      selectQuotesFirst();
    }

    const updatedPlans = plans.map((plan) => {
      if (plan.id === planId) {
        // Filter out duplicates before updating the currentQuotes array
        const uniqueQuotesToAdd = selectedQuotes.filter(
          (selectedQuote) =>
            !plan.selectedQuotes.some(
              (planQuote) => planQuote.id === selectedQuote.id,
            ),
        );
        return {
          ...plan,
          selectedQuotes: [...plan.selectedQuotes, ...uniqueQuotesToAdd],
        };
      }
      return plan;
    });

    setPlans(updatedPlans);
    handleClearCheckboxes();
  };

  const parseValue = (value: string | undefined): number => {
    if (
      value === undefined ||
      value === null || // Add this check for null values
      value === "MISSING" ||
      value === "" ||
      value.includes("N/A") ||
      value.includes("/") ||
      value.includes("+")
    )
      return Number.POSITIVE_INFINITY;

    // Remove commas, dollar signs, and periods
    const cleanedValue = value.replace(/[,$.]/g, "");

    // If the value is a percentage (contains '%'), remove '%' and convert to a number
    if (cleanedValue.includes("%")) {
      return parseFloat(cleanedValue.replace("%", "")) || 0;
    }

    // If the value is a regular number or a numeric string, convert it to a number
    return Number(cleanedValue) || 0;
  };

  useEffect(() => {
    const clientId = searchParams.get("clientId");

    if (clientId) {
      fetchClients(parseInt(clientId));
    }
  }, [fetchClients, searchParams]);

  const handleCloseComparison = () => {
    router.push(`/`);
  };

  function filterQuotesByCoverageType(coverage_type: string, isACA?: boolean) {
    let internalFilteredQuotes = quotes;

    internalFilteredQuotes = internalFilteredQuotes.filter((quote) => {
      return (
        ((quote?.["data"]?.["metadata"] as any)?.["coverage_type"] ??
          "medical") === coverage_type
      );
    });

    if (typeof isACA !== "undefined" && coverage_type === "medical") {
      internalFilteredQuotes = internalFilteredQuotes.filter((quote) => {
        const isAcaMetadata = (quote?.["data"]?.["metadata"] as any)?.[
          "is_aca"
        ];
        // Explicitly treat undefined as false
        const isAcaValue = isAcaMetadata === undefined ? false : isAcaMetadata;
        console.log("CHECK", isAcaMetadata, isACA, isAcaValue === isACA);
        return isAcaValue === isACA;
      });
    }

    return internalFilteredQuotes;
  }

  let filteredQuotes = filterQuotesByCoverageType(
    TABS_TO_COVERAGE_TYPE_MAPPING[currentTab as TabOption],
    currentTab === "ACA",
  );

  const currentPlan = plans.find((plan) => plan.isCurrentPlan);

  if (currentPlan) {
    const currentPlanQuotes = currentPlan.selectedQuotes;
    filteredQuotes = filteredQuotes.sort((quoteA, quoteB) => {
      if (currentPlanQuotes.map((quote) => quote.id).includes(quoteA.id)) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  const parseValue2 = (value: string | undefined): number => {
    if (value === "0") {
      return 0;
    }
    if (
      value === undefined ||
      value === null ||
      value === "deductible" ||
      value === "MISSING" ||
      value === "" ||
      value.includes("N/A") ||
      value.includes("/") ||
      value.includes("+")
    ) {
      return 0;
    }
    // Before cleaning up the value, truncate digits after the decimal point
    const withoutParenthesis = value.split("(")[0];
    const withoutDecimal = withoutParenthesis.split(".")[0];
    // Remove commas, dollar signs, and any periods that might be left
    const cleanedValue = withoutDecimal.replace(/[,+$]/g, "");
    // If the value is a percentage (contains '%'), remove '%' and convert to a number
    if (cleanedValue.includes("%")) {
      return parseFloat(cleanedValue.replace("%", "")) || 0;
    }
    // If the value is a regular number or a numeric string, convert it to a number
    return Number(cleanedValue);
  };

  function findMinimumValue(category: string) {
    let specificQuotes = filteredQuotes;
    return (
      Math.min(
        ...specificQuotes.map((quote) =>
          parseValue2((quote.data as any)?.[category] ?? "0"),
        ),
      ) | 0
    );
    // else if (category === "coinsurance") {
    //   return Math.min(...quotes.map((quote) => parseValue((quote.data as any)?.["coinsurance"] ?? "0"))) | 0;
    // }
  }

  function findMaximumValue(category: string) {
    let specificQuotes = filteredQuotes;

    return (
      Math.max(
        ...specificQuotes.map((quote) =>
          parseValue2((quote.data as any)?.[category] ?? "0"),
        ),
      ) | 0
    );
    // else if (category === "coinsurance") {
    //   return Math.max(...quotes.map((quote) => parseInt((quote.data as any)?.["coinsurance"] ?? '0') || 0));
    // }
  }

  const [valueDeductible, setValueDeductible] = React.useState<number[]>([
    findMinimumValue("deductible"),
    findMaximumValue("deductible"),
  ]);
  // const [valueCoinsurance, setValueCoinsurance] = React.useState<number[]>([20, 37]);
  const [valueOOP, setValueOOP] = React.useState<number[]>([
    findMinimumValue("out_of_pocket_max"),
    findMaximumValue("out_of_pocket_max"),
  ]);

  const [valueEmployeeRate, setValueEmployeeRate] = React.useState<number[]>([
    findMinimumValue("employee_rate"),
    findMaximumValue("employee_rate"),
  ]);

  useEffect(() => {
    // Reset valueDeductible and valueOOP when currentTab changes.
    setValueDeductible([
      findMinimumValue("deductible"),
      findMaximumValue("deductible"),
    ]);
    setValueOOP([
      findMinimumValue("out_of_pocket_max"),
      findMaximumValue("out_of_pocket_max"),
    ]);
    setValueEmployeeRate([
      findMinimumValue("employee_rate"),
      findMaximumValue("employee_rate"),
    ]);
  }, [currentTab]);

  if (!selectedClient) {
    return <></>;
  }

  return (
    <>
      <main className="flex w-full h-full overflow-x-scroll pl-4 md:pl-0 bg-gray-100">
        <Navbar selected="Quotes" />
        <div className="w-full md:w-6/7 flex">
          <div className="h-screen overflow-x-scroll flex-col w-full bg-gray-100 bg-opacity-50 pl-2 pr-6 pt-5 pb-6 text-gray-700">
            <div className="flex w-full items-center mb-4 mt-1 justify-between">
              <div className="flex items-center text-sm md:text-base">
                <button
                  className="flex items-center"
                  onClick={handleCloseComparison}
                >
                  <IoMdArrowBack />
                  <p className="ml-2 mr-2">Clients / </p>
                </button>
                <IconBuilding className="h-5 w-5 mr-2" />
                <p className="mr-2">{selectedClient?.name || "Client"}</p>
                {/* <p className="mr-1">/ Quotes</p>
            <p className="mr-1 text-gray-400 text-xs">•</p>
            <p className="text-gray-400">({quotes.length})</p> */}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(event) => {
                    handleAddNewQuote(event);
                  }}
                  className="text-sm md:text-base mr-1 outline outline-1 outline-gray-200 py-1 px-2 rounded-md flex items-center justify-center hover:bg-gray-100/80 cursor-pointer"
                >
                  <div className="mr-2">Add Quotes</div>
                  <MdFileUpload />
                </button>
              </div>
            </div>

            <div className="rounded-md w-full flex-col overflow-x-scroll h-full overflow-y-scroll bg-white outline outline-1 outline-gray-200">
              <div className="py-2 px-4 h-full">
                <SelectQuotesHeader
                  search={search}
                  setSearch={setSearch}
                  quotes={filteredQuotes}
                  handleSort={handleSort}
                  setSelectedFilter={setSelectedFilter}
                  handleBusiness={handleBusiness}
                  selectedFilter={selectedFilter}
                  valueDeductible={valueDeductible}
                  setValueDeductible={setValueDeductible}
                  valueEmployeeRate={valueEmployeeRate}
                  setValueEmployeeRate={setValueEmployeeRate}
                  valueOOP={valueOOP}
                  setValueOOP={setValueOOP}
                  findMaximumValue={findMaximumValue}
                  findMinimumValue={findMinimumValue}
                  currentTab={currentTab}
                  TabHeader={
                    <TabHeader
                      tabs={TABS}
                      titles={TABS.map((tab) => {
                        return `${tab} (${filterQuotesByCoverageType(TABS_TO_COVERAGE_TYPE_MAPPING[tab as TabOption], tab === "ACA").length})`;
                      })}
                      selectedTab={currentTab}
                      setSelectedTab={setCurrentTab}
                    />
                  }
                />

                <QuotesTable
                  quotes={filteredQuotes}
                  coverageType={coverageType}
                  planAttributes={planAttributes}
                  entryWidth={entryWidth}
                  handleCheckboxChange={handleCheckboxChange}
                  handleAddNewQuote={handleAddNewQuote}
                  search={search}
                  valueOOP={valueOOP}
                  parseValue2={parseValue2}
                  valueDeductible={valueDeductible}
                  valueEmployeeRate={valueEmployeeRate}
                  findMaximumValue={findMaximumValue}
                  findMinimumValue={findMinimumValue}
                />
              </div>
            </div>
          </div>
          <SelectSidebar
            selectedClient={selectedClient}
            setPlans={setPlans}
            plans={plans}
            newPlanName={newPlanName}
            setNewPlanName={setNewPlanName}
            handleAddQuotesToPlan={handleAddQuotesToPlan}
            setSnackbar={setSnackbar}
            coverageType={
              TABS_TO_COVERAGE_TYPE_MAPPING[currentTab as TabOption]
            }
          />
        </div>
      </main>

      {modalOpen === "addCurrentPlan" && (
        <AddCurrentPlanModal
          setModalOpen={setModalOpen}
          client={selectedClient}
          fetchClients={fetchClients}
        />
      )}

      {modalOpen === "addNewQuote" && (
        <AddQuote
          onClose={() => {
            setModalOpen("");
          }}
          setModalOpen={setModalOpen}
          client={selectedClient}
          type={"Select"}
        />
      )}
      {selectedQuotes.length > 0 && (
        <ActionBar actionBarEntries={actionBarEntries} />
      )}
    </>
  );
}
