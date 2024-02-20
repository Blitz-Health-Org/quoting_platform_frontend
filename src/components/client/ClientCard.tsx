import { ClientType } from "@/src/types/custom/Client";
import { FaBook, FaPlus, FaTrash } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import Image from "next/image";
import { AddNewQuoteModal } from "@/src/components/client/modal/AddNewQuoteModal";
import { CreateHandbookModal } from "@/src/components/client/modal/CreateHandbookModal";
import { ViewQuoteModal } from "@/src/components/client/modal/ViewQuoteModal";
import { useState } from "react";
import { IconBuilding } from "@tabler/icons-react";
import { supabase } from "@/src/supabase";
import error from "next/error";
import { SnackbarAlert } from "../ui/SnackbarAlert";

export type ClientCardProps = {
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
  setOpenSnackbarShare,
  handleClientDelete,
}: ClientCardProps) => {
  const [modalOpen, setModalOpen] = useState<string>("");

  function handleCreateHandbook() {
    setOpenSnackbarShare({
      open: true,
      message: `This feature is coming soon!`,
      severity: "info",
    }); // Use prop to set state
    return;
  }

  function handleViewQuote() {
    setModalOpen("viewQuote");
    return;
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
        className="w-full relative flex flex-col justify-between bg-white shadow-sm outline outline-1 outline-gray-200 rounded-md p-3"
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
              <IconBuilding className="mr-2" />
            )}
            <p>{client.name}</p>
          </div>
          <div className="text-gray-500 text-sm font-light mb-1">
            <p className="mt-3"> Plans - 9 </p>
            {/*//TODO:client.plans.length*/}
            <p className="mt-0.5"> Quotes - 72 </p>
            {/*//TODO:client.quotes.length*/}
            {client.num_lives !== null && (
              <p className="mt-0.5"> Lives - {client.num_lives} </p>
            )}
          </div>
        </div>

        <div className="w-full">
          {/* TODO: Flush to bottom */}
          <div className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-3 text-sm">
            <FaBook className="mr-1" />
            <button onClick={handleCreateHandbook}>Create Handbook</button>
          </div>
          <div
            onClick={handleViewQuote}
            className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-1 text-sm"
          >
            <IoEyeSharp className="mr-1" />
            <button onClick={handleViewQuote}>View Comparison</button>
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
      {modalOpen === "createHandbook" && (
        <CreateHandbookModal
          onClose={() => {
            setModalOpen("");
          }}
          client={client}
        />
      )}
      {modalOpen === "viewQuote" && (
        <ViewQuoteModal
          onClose={() => {
            setModalOpen("");
          }}
          client={client}
        />
      )}
      {modalOpen === "addNewQuote" && (
        <CreateHandbookModal
          onClose={() => {
            setModalOpen("");
          }}
          client={client}
        />
      )}
    </>
  );
};
