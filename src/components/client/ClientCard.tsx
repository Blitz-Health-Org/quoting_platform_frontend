import { ClientType } from "@/src/types/custom/Client";
import { FaBook, FaPlus, FaTrash } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import Image from "next/image";
import { AddNewQuoteModal } from "@/src/components/client/modal/AddNewQuoteModal";
import { AddQuote } from "@/src/components/client/modal/AddQuote";
import { ViewQuoteModal } from "@/src/components/client/modal/ViewQuoteModal";
import { Dispatch, SetStateAction, useState } from "react";
import { IconBuilding } from "@tabler/icons-react";
import { supabase } from "@/src/supabase";
import error from "next/error";
import { SnackbarAlert } from "../ui/SnackbarAlert";
import { useRouter } from "next/navigation";

export type ClientCardProps = {
  setComparisonOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedClient: Dispatch<SetStateAction<ClientType>>
  client: ClientType;
  handleClientDelete: (client: ClientType) => void;
  setOpenSnackbarShare: ({
    open,
    message,
    severity,
  }: {
    open: boolean;
    message: string;
    severity: string;
  }) => void;
};

export const ClientCard = ({
  client,
  setSelectedClient,
  setOpenSnackbarShare,
  handleClientDelete,
  setComparisonOpen
}: ClientCardProps) => {
  const [modalOpen, setModalOpen] = useState<string>("");
  const router = useRouter();

  function handleCreateHandbook() {
    setOpenSnackbarShare({
      open: true,
      message: `This feature is coming soon!`,
      severity: "info",
    }); // Use prop to set state
    return;
  }

  function handleNewComparison() {
    setComparisonOpen(true);
    setSelectedClient(client)
    return;
  }

  function handleViewComparison() {
    router.push(
      `/quotes?clientId=${client.id}&quoteIds=${client.selected_quotes?.join(",")}`,
    );
    return;
  }

  const letterToColorMap: { [key: string]: string } = {
    A: "#ff583315",
    B: "#33FF5715",
    C: "#5733FF15",
    D: "#FF336615",
    E: "#33FF3315",
    F: "#3333FF15",
    G: "#FF663315",
    H: "#33FF9315",
    I: "#3333CC15",
    J: "#FF333615",
    K: "#33FFAA15",
    L: "#3333DD15",
    M: "#FF339915",
    N: "#33FFCC15",
    O: "#3333FF15",
    P: "#FF993315",
    Q: "#33FFDD15",
    R: "#3333FF15",
    S: "#FFCC3315",
    T: "#33FF9915",
    U: "#3333FF15",
    V: "#FF333315",
    W: "#33FFBB15",
    X: "#3333FF15",
    Y: "#FF333315",
    Z: "#33FFCC15",
  };    

  function getColorForLetter(letter: string) {
    return letterToColorMap[letter.toUpperCase()] || "#999999"; // Default color if not found
  }

  function handleAddNewQuote() {
    setModalOpen("addNewQuote");
    return;
  }

  function handleClientCardClick() {
    return;
  }

  return (
    <>
      <div
        onClick={handleClientCardClick}
        className="col-span-1 w-full relative flex flex-col justify-between bg-white shadow-sm outline outline-1 outline-gray-200 rounded-md p-3"
      >
        <button
          className="absolute right-0 top-0 mt-2 mr-2"
          onClick={() => handleClientDelete(client)}
        >
          <FaTrash />
        </button>
        <div className="w-full">
          <div className="flex items-center gap-1">
            {client.icon ? (
              <Image
                src={client.icon} //TODO: provide defaultImage, make this default in the suapbase not case catching on the fe
                alt="Description of the image"
                width={30}
                height={30}
                className="mr-2 rounded-md"
              />
            ) : (
              <div
              className="mr-2 w-8 h-8 rounded-full flex items-center justify-center outline outline-1 outline-gray-300"
              style={{ backgroundColor: getColorForLetter(client.name?.[0] ?? "B") }}
            >
              <p className="font-bold">{(client.name?.[0] ?? "B").toUpperCase()}</p>
            </div>
            )}
            <p className="truncate max-h-32">{client.name}</p>
          </div>
        </div>

        <div className="w-full">
          {/* TODO: Flush to bottom */}
          <div className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-3 text-sm">
            <FaBook className="mr-1" />
            <button onClick={handleCreateHandbook}>Create Handbook</button>
          </div>
          <div
            onClick={client.selected_quotes ? handleViewComparison : handleNewComparison}
            className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-1 text-sm"
          >
            {client.selected_quotes ? <IoEyeSharp className="mr-1" /> : <FaPlus className="mr-1" />}
            <button>
              {client.selected_quotes ? "View Comparison" : "New Comparison"}
            </button>
          </div>
          <div
            onClick={handleAddNewQuote}
            className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-1 text-sm"
          >
            <FaPlus className="mr-1" />
            <div>Add Quotes</div>
          </div>
        </div>
      </div>
      {modalOpen === "viewQuote" && (
        <ViewQuoteModal
          onClose={() => {
            setModalOpen("");
          }}
          client={client}
          setOpenSnackbarShare={setOpenSnackbarShare}
        />
      )}
      {modalOpen === "addNewQuote" && (
        <AddQuote
          onClose={() => {
            setModalOpen("");
          }}
          setModalOpen={setModalOpen}
          client={client}
          setOpenSnackbarShare={setOpenSnackbarShare}
          setComparisonOpen={setComparisonOpen}
          setSelectedClient={setSelectedClient}
        />
      )}
    </>
  );
};
