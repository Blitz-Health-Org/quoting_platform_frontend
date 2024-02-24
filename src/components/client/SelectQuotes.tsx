"use client";

import Image from "next/image";
import { BiPlus } from "react-icons/bi";
import { NewClientModal } from "@/src/components/client/modal/NewClient";
import { ClientType } from "@/src/types/custom/Client";
import { useRouter } from "next/navigation";
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
import NewProject from "@/public/NewProject.jpg";
import { SocketContext } from "@/src/context/SocketContext";

export default function SelectQuotes({
  setComparisonOpen,
  setSelectedClient,
  selectedClient,
}: {
  setComparisonOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedClient: Dispatch<SetStateAction<ClientType>>;
  selectedClient: ClientType;
}) {
  type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

  const carrierLogos = {
    Aetna: AetnaLogo,
    Anthem: AnotherCarrierLogo,
    Cigna: Cigna,
    United: United,
    Chamber: Chamber,
    Other: NewProject,
  };

  const { socket } = useContext(SocketContext);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [quotes, setQuotes] = useState<QuoteTypeWithCheckbox[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // default severity
  });
  const router = useRouter();

  useEffect(() => {
    if (socket) {
      // Connect to the Socket.IO server
      // Listen for 'task_complete' events
      socket.on("task_complete", (data) => {
        console.log("Task Complete:", data);
        fetchQuoteData();
      });

      // Listen for 'task_status' events
      socket.on("task_status", (data) => {
        console.log("Task Status:", data);
      });

      return () => {
        console.log("rip");
        socket.off("task_complete");
        socket.off("task_status");
        socket.close();
      };
    }
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
    const selected = quotes?.filter((quote) => quote.isSelected) || [];
    const clientId = selectedClient.id;
    const selectedQuoteIds =
      quotes?.filter((quote) => quote.isSelected).map((quote) => quote.id) ||
      [];
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
    // Replace 'YOUR_CLIENT_ID' with the actual client ID you want to filter by
    const { data, error } = await supabase
      .from("quotes")
      .select()
      .eq("client_id", selectedClient.id);

    if (error) {
      alert("Error updating data");
    } else {
      console.log(data);
      setQuotes(data);
    }
  };

  useEffect(() => {
    fetchQuoteData();
  }, []);

  const copyUrlToClipboard = () => {
    // Use window.location.href to get the current URL
    const url = window.location.href;

    // Use the Clipboard API to write the text
    navigator.clipboard
      .writeText(url)
      .then(() => {
        // Optional: Display a message or call a function to indicate success
        setSnackbar({
          open: true,
          message: "This functionality is coming soon!",
          severity: "info",
        });
      })
      .catch((err) => {
        // Optional: Handle any errors
        console.error("Failed to copy URL to clipboard", err);
      });
  };

  const handleNewClientClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  async function handleClientDelete(client: ClientType) {
    // SEND DATA
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", selectedClient.id);

      if (error) {
        setSnackbar({
          open: true,
          message: "Delete failed",
          severity: "error",
        });
        console.error("Error inserting data:", error);
      } else {
        //UPDATE DATA
        try {
          const { data, error } = await supabase.from("clients").select();
          if (error) {
            alert("Error retrieving data");
          } else {
            setClients(data);
            console.log("Data retrieved successfully:", data);
          }
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Delete failed",
            severity: "error",
          });
        }
        setSnackbar({
          open: true,
          message: `${client.name} Deleted!`,
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Delete failed",
        severity: "error",
      });
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseComparison = () => {
    setSelectedClient(undefined as unknown as ClientType);
    setComparisonOpen(false);
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
            <p className="mr-1">/ Quotes</p>
            <p className="mr-1 text-gray-400 text-xs">•</p>
            <p className="text-gray-400">({quotes.length})</p>
          </div>
          <div className="flex items-center">
            <div className="text-sm md:text-base mr-1 outline outline-1 outline-gray-200 py-1 px-2 rounded-md flex items-center justify-center hover:bg-gray-100/80 cursor-pointer">
              <BiPlus className="mr-2" />
              <button onClick={handleNextClick}>Comparison</button>
            </div>
          </div>
        </div>
        <div className="rounded-md w-full flex-col h-full pb-12 overflow-y-scroll bg-white outline outline-1 outline-gray-200">
          <div className="py-2 px-4">
            {/* <div className="w-full flex">
            <div className="w-1/4 flex items-center gap-2"> 
              <IoDocumentTextOutline className="h-5 w-5"/>
              <p> Showing {quotes.length} Quotes </p>
            </div>
            <div className="w-1/2 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                <FaSearch className="h-4 w-4 text-gray-500" />
              </div>
              <input placeholder="Search" className="bg-gray-100/50 w-full px-10 py-1 rounded-sm outline outline-1 outline-gray-300"></input>
            </div>
            <div className="w-1/4"> 
              <div className="flex items-center justify-end"> 
                <button className="px-2 py-1 flex items-center gap-1">
                  <p>Sort</p>
                  <FaChevronDown className="h-3 w-3"/>
                </button> 
                <button className="px-2 py-1 flex items-center gap-1">
                  <p>Filter</p>
                  <FaChevronDown className="h-3 w-3"/>
                </button> 
              </div> 
            </div>
          </div> */}
            <div className="flex px-2 w-fit border-b">
              <input type="checkbox" disabled />
              <div className="grid-cols-9 flex justify-left text-center w-fit gap-1 h-20 font-bold items-center text-wrap text-sm">
                {/* Carrier Name */}
                <div className="w-32">Carrier</div>
                {/* Plan Name */}
                <p className="w-32">Plan</p>
                {/* Funding () */}
                <p className="w-32">Funding</p>
                {/* Office Copay (PCP/Specialist) */}
                <p className="w-32">Office Copay (PCP/Specialist)</p>
                {/* Deductible (Individual) */}
                <p className="w-32">Deductible (Individual)</p>
                {/* Coinsurance (In-Network) */}
                <p className="w-32">Coinsurance (In-Network)</p>
                {/* Out of Pocket (Individual) */}
                <p className="w-32">Out of Pocket (Individual)</p>
                {/* Additional Copays Include (ER / Imaging / OP / IP) */}
                <p className="w-32">
                  Additional Copays (ER / Imaging / OP / IP)
                </p>
                {/* Total Monthly Premium */}
                <p className="w-32">Total Monthly Premium</p>
              </div>
            </div>
            {quotes.map((quote) => (
              <p key={quote.id}>
                <div className="flex items-center w-fit mb-1 mt-1 p-2 border-b">
                  <input
                    type="checkbox"
                    checked={quote.isSelected}
                    onChange={() => handleCheckboxChange(quote.id)}
                  />
                  <div className="grid-cols-9 flex justify-left text-center w-fit gap-1 h-8 items-center overflow-hidden text-sm">
                    {/* Carrier Name */}

                    <div className="w-32 flex items-center justify-center">
                      <Image
                        src={
                          carrierLogos[
                            quote.carrier as keyof typeof carrierLogos
                          ] || carrierLogos["Other"]
                        }
                        alt={`Logo for ${quote.carrier}`}
                        width={20}
                        height={20}
                        className="mr-2 rounded-md"
                      />
                      <p>{quote.carrier || "Sup"}</p>
                    </div>
                    {/* Plan Name */}
                    <p className="w-32">Aetna Gold Select</p>
                    {/* Funding () */}
                    <p className="w-32">Level Funded</p>
                    {/* Office Copay (PCP/Specialist) */}
                    <p className="w-32">$25 / $75</p>
                    {/* Deductible (Individual) */}
                    <p className="w-32">$5,000</p>
                    {/* Coinsurance (In-Network) */}
                    <p className="w-32">80%</p>
                    {/* Out of Pocket (Individual) */}
                    <p className="w-32">$7,900</p>
                    {/* Additional Copays Include (ER / Imaging / OP / IP) */}
                    <p className="w-32">$300 / N/A / N/A / N/A</p>
                    {/* Total Monthly Premium */}
                    <p className="w-32">{quote.file_name}</p>
                  </div>
                </div>
              </p>
            ))}
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
    </>
  );
}
