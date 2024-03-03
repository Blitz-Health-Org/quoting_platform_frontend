"use client";

import Image, { StaticImageData } from "next/image";
import { ClientType } from "@/src/types/custom/Client";
import { useRouter } from "next/navigation";
import { MdFileUpload } from "react-icons/md";
import { SnackbarAlert } from "../../components/ui/SnackbarAlert";
import { supabase } from "../../supabase";
import { notFound, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
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

export default function SelectQuotes() {
  type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };
  const {
    modalOpen: [modalOpen, setModalOpen],
  } = useContext(ModalContext);
  const searchParams = useSearchParams();
  const [selectedClient, setSelectedClient] = useState<ClientType>(
    undefined as unknown as ClientType,
  );

  useEffect(() => {
    const clientId = searchParams.get("clientId") as string;
    if (selectedClient === undefined) fetchClients(clientId);
  }, [searchParams, selectedClient]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [selectedQuotes, setSelectedQuotes] = useState<QuoteTypeWithCheckbox[]>(
    [],
  );

  const [pdfParsingLoading, setPdfParsingLoading] = useState(false);

  const handleBusiness = () => {
    setSnackbar({
      open: true,
      message: "This feature is coming soon!",
      severity: "info",
    });
  };

  const planAttributesMapping: {
    key: keyof PlanAttributes;
    label: string;
    alternateKey?: string;
  }[] = [
    { key: "carrier", label: "Carrier" },
    { key: "plan_id", alternateKey: "plan_name", label: "Plan" },
    // { key: "plan_type", label: "Plan Type" },
    // { key: "office_copay", label: "Office Copay (PCP/Specialist)" },
    { key: "deductible", label: "Deductible (Individual)" },
    { key: "coinsurance", label: "Coinsurance (In-Network)" },
    { key: "out_of_pocket_max", label: "Out of Pocket (Individual)" },
    {
      key: "additional_copay",
      label: "Additional Copays (ER / Imaging / OP / IP)",
    },
    { key: "total_cost", label: "Total Monthly Premium" },
  ];

  const [entryWidth, setEntryWidth] = useState(
    innerWidth / planAttributesMapping.length,
  );

  const [quotes, setQuotes] = useState<QuoteTypeWithCheckbox[]>([]);

  const {
    userId: [userId, , loading],
  } = useContext(UserContext);

  const router = useRouter();
  const [search, setSearch] = useState<string>();

  const fetchClients = async (clientId: string) => {
    try {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (clientError) throw clientError;

      setSelectedClient(clientData);
      fetchQuoteData(clientData);
    } catch (error) {
      console.error("Failed to fetch client and quotes", error);
    }
  };

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

  useEffect(() => {
    // Update entryWidth when the screen size changes

    const handleResize = () => {
      setEntryWidth(innerWidth / planAttributesMapping.length);
    };

    // Attach event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  interface PlanAttributes {
    plan_id: string;
    carrier: string;
    plan_name: string;
    plan_type: string;
    office_copay: string;
    deductible: string;
    coinsurance: string;
    out_of_pocket_max: string;
    additional_copay: string;
    total_cost: string;
  }

  const [sortOrder, setSortOrder] = useState("asc"); // Initial sorting order

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [originalQuotes, setOriginalQuotes] = useState<QuoteTypeWithCheckbox[]>(
    [],
  );
  const [plans, setPlans] = useState<
    Array<{ id: number; name: string; selectedQuotes: QuoteTypeWithCheckbox[] }>
  >([]);
  const [newPlanName, setNewPlanName] = useState("");

  const handleAddQuotesToPlan = (planId: number) => {
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
    // updateConnectedPlans(updatedPlans);
    handleClearCheckboxes();
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

    setQuotes(sortedQuotes);
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
    if (selectedClient) {
      console.log("in socket", selectedClient);
      const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!}`, {
        path: "/socket.io",
        transports: ["websocket"],
      });

      // Connect to the Socket.IO server
      // Listen for 'task_complete' events
      socket.on("sub_task_complete", (data) => {
        console.log("Task Complete:", data);
        fetchQuoteData(selectedClient);
      });

      // Listen for 'task_status' events
      socket.on("task_status", (data) => {
        console.log("Task Status:", data);
        if (data.status == "started") {
          setPdfParsingLoading(true);
        }
        if (data.status === "failed") {
          toast.error("Failed to process PDFs. Please try again.");
          setPdfParsingLoading(false);
        }
      });

      socket.on("task_finished", (data) => {
        console.log("Task Finished:");
        setPdfParsingLoading(false);
        toast.success("PDF(s) processed successfully");
      });

      return () => {
        socket.off("sub_task_complete");
        socket.off("task_status");
        socket.off("task_finished");
        socket.close();
      };
    }
  }, [selectedClient]);

  useEffect(() => {
    if (pdfParsingLoading) {
      toast.loading("Processing PDF(s)...", {
        id: "pdfParsing",
      });
    } else {
      toast.dismiss("pdfParsing");
    }
  }, [pdfParsingLoading]);

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

  const fetchQuoteData = async (clientData: any) => {
    if (clientData) {
      const { data, error } = await supabase
        .from("quotes")
        .select()
        .eq("client_id", clientData.id);

      if (error) {
        alert("Error updating data");
      } else {
        // Check if selected_quotes is not null
        setQuotes(data);
        setOriginalQuotes(data);

        if (clientData.connected_plans) {
          // Check if there is data for connected_plans
          setPlans((clientData.connected_plans as any) || []); // Update plans state
        }
      }
    }
  };

  const handleCloseComparison = () => {
    router.push(`/`);
  };

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
                  onClick={handleAddNewQuote}
                  className="text-sm md:text-base mr-1 outline outline-1 outline-gray-200 py-1 px-2 rounded-md flex items-center justify-center hover:bg-gray-100/80 cursor-pointer"
                >
                  <div className="mr-2">Add Quotes</div>
                  <MdFileUpload />
                </button>
              </div>
            </div>
            <div className="rounded-md w-full flex-col overflow-x-hidden h-full pb-12 overflow-y-scroll bg-white outline outline-1 outline-gray-200">
              <div className="py-2 px-4">
                <SelectQuotesHeader
                  search={search}
                  setSearch={setSearch}
                  quotes={quotes}
                  handleSort={handleSort}
                  setSelectedFilter={setSelectedFilter}
                  handleBusiness={handleBusiness}
                  selectedFilter={selectedFilter}
                />
                <div className="w-full overflow-x-auto">
                  <div className="flex py-2 w-fit border-b">
                    <div className="grid-cols-9 flex justify-left text-center w-fit gap-1 h-20 font-bold items-center text-wrap text-sm">
                      {planAttributesMapping.map((attribute) => (
                        <div
                          key={attribute.key}
                          className="flex justify-center gap-2 min-w-32"
                          style={{ width: `${entryWidth}px` }}
                        >
                          <p>{attribute.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {quotes.length === 0 ? (
                    <div className="flex w-full mt-16 mb-2 h-fit items-center justify-center flex-col">
                      <p className="mb-2">No Quotes</p>
                      <button
                        onClick={handleAddNewQuote}
                        className="bg-gray-100 outline outline-1 outline-gray-300 rounded-md px-2 py-0.5"
                      >
                        Add Quotes
                      </button>
                    </div>
                  ) : (
                    quotes
                      .filter(
                        (quote: any) =>
                          !search || // Only apply the filter if search is empty
                          ((quote.data as any)?.["plan_id"] + quote.carrier)
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                      )
                      .map((quote) => (
                        <div
                          key={quote.id}
                          className="flex items-center w-fit mb-1 mt-1 py-2 border-b"
                        >
                          <div className="grid-cols-9 w-full flex justify-left text-center w-fit gap-1 h-8 items-center text-sm">
                            {/* Map through the plan attributes for each quote */}
                            {planAttributesMapping.map((attribute) => (
                              <div
                                key={attribute.key}
                                className="min-w-32 max-h-10 overflow-y-auto"
                                style={{ width: `${entryWidth}px` }}
                              >
                                {attribute.key === "carrier" ? (
                                  <div className="flex items-center justify-left ml-6">
                                    <input
                                      type="checkbox"
                                      checked={quote.isSelected}
                                      onChange={() =>
                                        handleCheckboxChange(quote.id)
                                      }
                                      className="mr-4"
                                    />
                                    {quote.logo_url && (
                                      <Image
                                        src={quote.logo_url}
                                        alt={`Logo for ${quote[attribute.key]}`}
                                        width={20}
                                        height={20}
                                        className="mr-2 rounded-md"
                                      />
                                    )}
                                    <p>{quote[attribute.key] || "Sup"}</p>
                                  </div>
                                ) : (
                                  <p>
                                    {(quote.data as any)?.[attribute.key] ??
                                      "N/A"}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            <SnackbarAlert
              openSnackbarShare={snackbar.open}
              setOpenSnackbarShare={setSnackbar}
              snackbar={snackbar}
            />
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

      <SnackbarAlert
        openSnackbarShare={snackbar.open}
        setOpenSnackbarShare={setSnackbar}
        snackbar={{
          open: snackbar.open,
          message: snackbar.message,
          severity: snackbar.severity,
        }}
      />
    </>
  );
}
