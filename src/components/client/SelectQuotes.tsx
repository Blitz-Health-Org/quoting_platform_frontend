"use client";

import { PiListBulletsBold } from "react-icons/pi";
import { RiArrowDropDownLine } from "react-icons/ri";
import Apple from "../../public/Apple.jpg";
import Image from "next/image";
import { FaBook } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { CiShare1 } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { BiPlus } from "react-icons/bi";
import { useDropzone } from "react-dropzone";
import { Snackbar, Alert } from "@mui/material";
import { NewClientModal } from "@/src/components/client/modal/NewClientModal";
import { MdUpload } from "react-icons/md";
import { ClientCard } from "@/src/components/client/ClientCard";
import { UserContext } from "@/src/context/UserContext";
import { ClientType } from "@/src/types/custom/Client";
import { useRouter } from "next/navigation";
import { SnackbarAlert } from "../ui/SnackbarAlert";
import error from "next/error";
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

  const [clients, setClients] = useState<ClientType[]>([]);
  const [quotes, setQuotes] = useState<QuoteTypeWithCheckbox[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // default severity
  });

  const router = useRouter();

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
      .upsert({ id: selectedClient.id, selected_quotes: selected });

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

  useEffect(() => {
    const fetchData = async () => {
      // Replace 'YOUR_CLIENT_ID' with the actual client ID you want to filter by
      const { data, error } = await supabase
        .from("quotes")
        .select()
        .eq("client_id", selectedClient.id);

      if (error) {
        alert("Error updating data");
      } else {
        setQuotes(data);
      }
    };

    fetchData();
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
    setComparisonOpen(false);
  };

  return (
    <>
      <main className="h-screen overflow-hidden flex-col w-full bg-gray-100 bg-opacity-50 pl-2 pr-6 pt-5 pb-6 text-gray-700">
        <div className="flex w-full items-center mb-4 mt-1 justify-between">
          <div className="flex items-center text-sm md:text-base">
            <button onClick={handleCloseComparison} className="mr-2">
              <IoMdArrowBack />
            </button>
            <p className="mr-2">Clients / </p>
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
          <div className="p-4">
            {quotes.map((quote) => (
              <p key={quote.id}>
                <input
                  type="checkbox"
                  checked={quote.isSelected}
                  onChange={() => handleCheckboxChange(quote.id)}
                />
                {quote.file_name}
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
