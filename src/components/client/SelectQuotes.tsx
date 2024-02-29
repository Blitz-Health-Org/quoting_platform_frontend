"use client";

import Image, { StaticImageData } from "next/image";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { NewClientModal } from "@/src/components/client/modal/NewClient";
import { LuArrowRightToLine, LuArrowLeftToLine } from "react-icons/lu";
import { ClientType } from "@/src/types/custom/Client";
import { useRouter } from "next/navigation";
import { MdFileUpload } from "react-icons/md";
import { SnackbarAlert } from "../ui/SnackbarAlert";
import { supabase } from "../../supabase";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { IoMdArrowBack } from "react-icons/io";
import { QuoteType } from "@/src/types/custom/Quote";
import { IconBuilding } from "@tabler/icons-react";
import AetnaLogo from "@/public/Screenshot.png";
import AnotherCarrierLogo from "@/public/Anthem.jpeg";
import Cigna from "@/public/Cigna.png";
import United from "@/public/United.png";
import Chamber from "@/public/Chamber.png";
import BCBS from "@/public/BCBS.png";
import NewProject from "@/public/NewProject.jpg";
import { SocketContext } from "@/src/context/SocketContext";
import { io } from "socket.io-client";
import { FiArrowRight } from "react-icons/fi";
import { UserContext } from "@/src/context/UserContext";
import SelectQuotesHeader from "../comparison/SelectQuotesHeader";

export default function SelectQuotes({
  setComparisonOpen,
  setSelectedClient,
  selectedClient,
  setModalOpen,
}: {
  setComparisonOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedClient: Dispatch<SetStateAction<ClientType>>;
  selectedClient: ClientType;
  setModalOpen: Dispatch<SetStateAction<string>>;
}) {
  type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

  const carrierLogos: Record<string, StaticImageData> = {
    Aetna: AetnaLogo,
    Anthem: AnotherCarrierLogo,
    Cigna: Cigna,
    United: United,
    Chamber: Chamber,
    BCBS: BCBS,
    Other: NewProject,
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [collapsed, setCollapsed] = useState(true);

  const handleBusiness = (index: any) => {
    setSnackbar({
      open: true,
      message: "This feature is coming soon!",
      severity: "info",
    });
  };

  const planAttributesMapping: { key: keyof PlanAttributes; label: string }[] =
    [
      { key: "carrier", label: "Carrier" },
      { key: "plan_id", label: "Plan" },
      { key: "plan_type", label: "Plan Type" },
      { key: "office_copay", label: "Office Copay (PCP/Specialist)" },
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
  const { socket } = useContext(SocketContext);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [quotes, setQuotes] = useState<QuoteTypeWithCheckbox[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    userId: [userId, , loading],
  } = useContext(UserContext);
  const [selectedQuotes, setSelectedQuotes] = useState<QuoteTypeWithCheckbox[]>(
    [],
  );

  const router = useRouter();
  const [search, setSearch] = useState<string>();

  function handleAddNewQuote(event: any) {
    event?.stopPropagation();
    setModalOpen("addNewQuote");
    setSelectedClient(selectedClient);
    return;
  }

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

  const [sortOption, setSortOption] = useState("deductible"); // Initial sorting option
  const [sortOrder, setSortOrder] = useState("asc"); // Initial sorting order
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [originalQuotes, setOriginalQuotes] = useState<QuoteTypeWithCheckbox[]>(
    [],
  );

  const handleSort = (option: string | null) => {
    if (option === null) {
      setQuotes(originalQuotes);
      return;
    }

    // Perform the sorting
    const sortedQuotes = quotes.slice().sort((a, b) => {
      const valueA = parseValue((a.data as any)?.[option]); // Remove extra parenthesis here
      const valueB = parseValue((b.data as any)?.[option]); // Remove extra parenthesis here

      if (sortOrder === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    // Update the state with the sorted quotes
    setQuotes(sortedQuotes);
  };

  const parseValue = (value: string | undefined): number => {
    if (
      value === undefined ||
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
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!}`, {
      path: "/socket.io",
      transports: ["websocket"],
    });
    // Connect to the Socket.IO server
    // Listen for 'task_complete' events
    socket.on("sub_task_complete", (data) => {
      console.log("Task Complete:", data);
      fetchQuoteData();
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
  }, []);

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

  const handleNextClick = async () => {
    const clientId = selectedClient.id;
    const selectedQuoteIds =
      quotes?.filter((quote) => quote.isSelected).map((quote) => quote.id) ||
      [];
    console.log("selectedQuotes", selectedQuoteIds);
    if (!selectedQuoteIds.length) {
      alert("No quotes selected");
      return;
    }

    // setSelectedQuotes(selected);
    const { data: insertData, error: insertError } = await supabase
      .from("clients") // Replace with your actual Supabase table name
      .upsert({ id: selectedClient.id, selected_quotes: selectedQuoteIds });

    if (insertError) {
      console.error("Error inserting row into Supabase table:", insertError);
      return { success: false };
    } else {
      router.push(
        `/quotes?clientId=${clientId}&quoteIds=${selectedQuoteIds.join(",")}`,
      );

      return { success: true };
    }
  };

  const fetchQuoteData = async () => {
    const { data, error } = await supabase
      .from("quotes")
      .select()
      .eq("client_id", selectedClient.id);

    if (error) {
      alert("Error updating data");
    } else {
      // Check if selected_quotes is not null
      if (selectedClient.selected_quotes !== null) {
        // Update isSelected attribute based on selected_quotes
        const updatedQuotes = data.map((quote) => {
          const isSelected = selectedClient.selected_quotes?.includes(
            quote.id.toString(),
          );
          return { ...quote, isSelected: isSelected || false };
        });

        // Sort the quotes so that selected ones appear above the ones that aren't selected
        const sortedQuotes = updatedQuotes.sort((a, b) => {
          // Put selected quotes above the ones that aren't selected
          return a.isSelected && !b.isSelected ? -1 : 1;
        });

        console.log("sortedQuotes", sortedQuotes);
        setQuotes(sortedQuotes);
        setOriginalQuotes(sortedQuotes);
      } else {
        // Handle the case where selected_quotes is null (if needed)
        setQuotes(data);
        setOriginalQuotes(data);
      }
    }
  };

  useEffect(() => {
    fetchQuoteData();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseComparison = () => {
    setSelectedClient(undefined as unknown as ClientType);
    setComparisonOpen(false);
    router.push(`/`);
  };

  return (
    <>
      <main className="flex w-full h-fit">
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
              <p className="mr-2">{selectedClient.name}</p>
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
              <button
                onClick={handleNextClick}
                className="text-sm md:text-base mr-1 outline outline-1 outline-gray-200 py-1 px-2 rounded-md flex items-center justify-center hover:bg-gray-100/80 cursor-pointer"
              >
                <div className="mr-2">New Comparison</div>
                <FiArrowRight />
              </button>
            </div>
          </div>
          <div className="rounded-md w-full flex-col overflow-x-hidden h-full pb-12 overflow-y-scroll bg-white outline outline-1 outline-gray-200">
            <div className="py-2 px-4">
              <SelectQuotesHeader
                search={search}
                setSearch={setSearch}
                quotes={quotes}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
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
                                <div className="flex items-center justify-center truncate">
                                  <input
                                    type="checkbox"
                                    checked={quote.isSelected}
                                    onChange={() =>
                                      handleCheckboxChange(quote.id)
                                    }
                                    className="mr-4"
                                  />
                                  <Image
                                    src={
                                      carrierLogos[
                                        quote[
                                          attribute.key
                                        ] as keyof typeof carrierLogos
                                      ] || carrierLogos["Chamber"]
                                    }
                                    alt={`Logo for ${quote[attribute.key]}`}
                                    width={20}
                                    height={20}
                                    className="mr-2 rounded-md"
                                  />
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
          {isModalOpen && (
            <NewClientModal
              setOpenSnackbarShare={setSnackbar}
              onClose={handleCloseModal}
              setClients={setClients}
            />
          )}
          <SnackbarAlert
            openSnackbarShare={snackbar.open}
            setOpenSnackbarShare={setSnackbar}
            snackbar={snackbar}
          />
        </div>

        <Sidebar
          backgroundColor="white"
          collapsed={collapsed}
          collapsedWidth="40px"
        >
          <div className="flex-col h-full w-full pt-3 justify-center">
            {collapsed && (
              <div className="flex-col h-full w-full p-2 text-center">
                <button
                  className="sb-button"
                  onClick={() => setCollapsed(false)}
                >
                  <LuArrowLeftToLine className="w-6 h-6" />
                </button>
              </div>
            )}

            {!collapsed && (
              <div className="flex gap-2 p-2">
                <button
                  className="sb-button"
                  onClick={() => setCollapsed(true)}
                >
                  <LuArrowRightToLine className="h-6 w-6" />
                </button>
                <p className="font-semibold text-lg">Plan Builder</p>
              </div>
            )}
          </div>
        </Sidebar>
      </main>

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
