"use client";

import Image, { StaticImageData } from "next/image";
import { ClientType } from "@/src/types/custom/Client";
import { redirect, useRouter } from "next/navigation";
import { MdFileUpload } from "react-icons/md";
import { SnackbarAlert } from "../../components/ui/SnackbarAlert";
import { supabase } from "../../supabase";
import { FaRegSave, FaRegStar } from "react-icons/fa";
import { notFound, useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { QuoteType } from "@/src/types/custom/Quote";
import { IconBuilding } from "@tabler/icons-react";
import { io } from "socket.io-client";
import { UserContext } from "@/src/context/UserContext";
import SelectQuotesHeader from "../../components/comparison/SelectQuotesHeader";
import { AddQuote } from "@/src/components/client/modal/AddQuote";
import { Navbar } from "@/src/components/comparison/Navbar";
import SelectSidebar from "@/src/components/SelectSidebar";
import toast from "react-hot-toast";
import { ModalContext } from "@/src/context/ModalContext";
import { TaskContext } from "@/src/context/TaskContext";
import { SocketTasksContext } from "@/src/context/SocketContext";
import AddCurrentPlanModal from "@/src/components/comparison/AddCurrentPlanModal";
import { SnackBarContext } from "@/src/context/SnackBarContext";
import { SelectedQuotesACAPage } from "@/src/components/client/SelectedQuotesACAPage";
import { SelectedQuotesNonACAPage } from "@/src/components/client/SelectedQuotesNonACAPage";
import TabHeader from "@/src/components/ui/TabHeader";
import { ActionBar } from "./ActionBar";

export interface PlanAttributes {
  isCurrentPlan: boolean;
  plan_id: string;
  carrier: string;
  plan_name: string;
  plan_type: string;
  office_copay: string;
  deductible: string;
  copay_coinsurance: string;
  out_of_pocket_max: string;
  additional_copay: string;
  total_employer_cost: string;
}

const planAttributesMapping: {
  key: keyof PlanAttributes;
  label: string;
  alternateKey?: string;
}[] = [
  { key: "carrier", label: "Carrier" },
  { key: "plan_id", alternateKey: "plan_name", label: "Plan" },
  { key: "deductible", label: "Deductible (Individual)" },
  { key: "copay_coinsurance", label: "Copay / Coinsurance (In-Network)" },
  { key: "out_of_pocket_max", label: "Out of Pocket (Individual)" },
  { key: "office_copay", label: "Office Copay (PCP/Specialist)" },
  // { key: "plan_type", label: "Network" },
  // { key: "additional_copay", label: "Additional Copays (ER / Imaging / OP / IP)", },
  { key: "total_employer_cost", label: "Total Cost" },
];

const TABS = ["NON-ACA", "ACA"];

export type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

export default function SelectQuotes() {
  type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

  const [modalOpen, setModalOpen] = useState<string>("");

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
      } else {
        // Check if selected_quotes is not null

        console.log("QUOTEDATA", data);

        setQuotes(data);
        setOriginalQuotes(data);

        if (client.connected_plans) {
          // Check if there is data for connected_plans
          setPlans((client.connected_plans as any) || []); // Update plans state
        }
      }
    }
  };

  // const {
  //   socketTasks: [originalSocketTasks, setSocketTasks],
  // } = useContext(SocketTasksContext);

  // const socketTasks = originalSocketTasks?.filter(
  //   (task) => task !== "fetch_quotes",
  // );

  const {
    taskInfo: [taskInfo, setTaskInfo],
  } = useContext(TaskContext);

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

  const [currentTab, setCurrentTab] = useState<string>("NON-ACA");
  const [search, setSearch] = useState<string | undefined>();

  const [sortOption, setSortOption] = useState("deductible"); // Initial sorting optio
  const [sortOrder, setSortOrder] = useState("asc"); // Initial sorting order

  const [entryWidth, setEntryWidth] = useState(
    innerWidth / planAttributesMapping.length,
  );

  const createNewPlanAndAddSelectedQuotes = () => {
    console.log("running create new plan and add selected qutoes");
    const newPlan = {
      id: Date.now(),
      isCurrentPlan: false,
      name: `Plan #${plans.length + 1}`,
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

  const actionBarEntries = [
    {
      label: "Delete",
      onClick: deleteQuotes,
      //TODO: add icon here
    },
    {
      label: "Add to New Plan",
      onClick: createNewPlanAndAddSelectedQuotes,
    },
  ];

  useEffect(() => {
    // Update entryWidth when the screen size changes

    const handleResize = () => {
      setEntryWidth(innerWidth / planAttributesMapping.length);
      console.log("yeah", entryWidth);
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

  const router = useRouter();

  const fetchClients = useCallback(async (clientId: number) => {
    try {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();
      if (clientError) throw clientError;
      console.log("CLIENTDATA", clientData);
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
      router.push(`/quotes?clientId=${clientId}`);

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
    console.log("CLIENT ID", clientId);

    if (clientId) {
      fetchClients(parseInt(clientId));
    }
  }, [fetchClients, searchParams]);

  const handleCloseComparison = () => {
    router.push(`/`);
  };

  const aca_quotes = quotes.filter(
    (quote) => (quote.data as any)?.["metadata"]?.["is_aca"] === true,
  );
  const non_aca_quotes = quotes.filter(
    (quote) => !(quote.data as any)?.["metadata"]?.["is_aca"] === true,
  );

  if (!selectedClient) {
    return <></>;
  }

  return (
    <>
      <main className="flex w-full h-full overflow-hidden">
        <Navbar selected="Quotes" />
        <div className="w-full md:w-6/7 flex">
          <div className="h-screen overflow-hidden flex-col w-full bg-gray-100 bg-opacity-50 pl-2 pr-6 pt-5 pb-6 text-gray-700">
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

            <div className="rounded-md w-full flex-col overflow-x-hidden h-full overflow-y-scroll bg-white outline outline-1 outline-gray-200">
              <div className="py-2 px-4 h-full">
                <SelectQuotesHeader
                  search={search}
                  setSearch={setSearch}
                  quotes={quotes}
                  handleSort={handleSort}
                  setSelectedFilter={setSelectedFilter}
                  handleBusiness={handleBusiness}
                  selectedFilter={selectedFilter}
                  TabHeader={
                    <TabHeader
                      tabs={TABS}
                      titles={[
                        `Non-ACA (${non_aca_quotes.length})`,
                        `ACA (${aca_quotes.length})`,
                      ]}
                      selectedTab={currentTab}
                      setSelectedTab={setCurrentTab}
                    />
                  }
                />

                {currentTab === "NON-ACA" && (
                  <SelectedQuotesNonACAPage
                    quotes={non_aca_quotes}
                    planAttributesMapping={planAttributesMapping}
                    entryWidth={entryWidth}
                    handleCheckboxChange={handleCheckboxChange}
                    handleAddNewQuote={handleAddNewQuote}
                    search={search}
                  />
                )}
                {currentTab === "ACA" && (
                  <SelectedQuotesACAPage
                    quotes={aca_quotes}
                    planAttributesMapping={planAttributesMapping}
                    entryWidth={entryWidth}
                    handleCheckboxChange={handleCheckboxChange}
                    handleAddNewQuote={handleAddNewQuote}
                    search={search}
                  />
                )}
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
