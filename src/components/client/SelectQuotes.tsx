"use client";

import Image, { StaticImageData } from "next/image";
import { BiPlus } from "react-icons/bi";
import { NewClientModal } from "@/src/components/client/modal/NewClient";
import { ClientType } from "@/src/types/custom/Client";
import { useRouter } from "next/navigation";
import { SnackbarAlert } from "../ui/SnackbarAlert";
import { supabase } from "../../supabase";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
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
import NewProject from "@/public/NewProject.jpg";
import { SocketContext } from "@/src/context/SocketContext";
import { io } from "socket.io-client";
import router from "next/router";
import { FiArrowRight } from "react-icons/fi";
import { UserContext } from "@/src/context/UserContext";

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
    Other: NewProject,
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  const router = useRouter();
  const [search, setSearch] = useState<string>();

  function handleAddNewQuote(event: any) {
    event?.stopPropagation();
    setModalOpen("addNewQuote");
    setSelectedClient(selectedClient);
    return;
  }

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
      } else {
        // Handle the case where selected_quotes is null (if needed)
        setQuotes(data);
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
      <main className="h-screen overflow-hidden flex-col w-full bg-gray-100 bg-opacity-50 pl-2 pr-6 pt-5 pb-6 text-gray-700">
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
          <div className="flex items-center">
            <div
              onClick={handleNextClick}
              className="text-sm md:text-base mr-1 outline outline-1 outline-gray-200 py-1 px-2 rounded-md flex items-center justify-center hover:bg-gray-100/80 cursor-pointer"
            >
              <div className="mr-2">New Comparison</div>
              <FiArrowRight />
            </div>
          </div>
        </div>
        <div className="rounded-md w-full flex-col overflow-x-hidden h-full pb-12 overflow-y-scroll bg-white outline outline-1 outline-gray-200">
          <div className="py-2 px-4">
            <div className="w-full flex mt-4 justify-center">
              <div className="w-1/4 flex items-center gap-2">
                <IoDocumentTextOutline className="h-5 w-5" />
                <p className="truncate"> Showing {quotes.length} Quotes </p>
              </div>
              <div className="w-1/3 ml-4 md:ml-0 md:w-1/2 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                  <FaSearch className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="bg-gray-100/50 w-full px-10 py-1 rounded-sm outline outline-1 outline-gray-300"
                ></input>
              </div>
              <div className="w-5/12 md:w-1/4">
                <div className="flex items-center justify-end">
                  <button
                    className="px-2 py-1 flex items-center gap-1"
                    onClick={handleBusiness}
                  >
                    <p>Sort</p>
                    <FaChevronDown className="h-3 w-3" />
                  </button>
                  <button
                    className="px-2 py-1 flex items-center gap-1"
                    onClick={handleBusiness}
                  >
                    <p>Filter</p>
                    <FaChevronDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
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
                      ((quote.data as any)?.["plan_name"] + quote.carrier)
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
                              <div className="flex items-center justify-center">
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
                                {(quote.data as any)?.[attribute.key] ?? "N/A"}
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
