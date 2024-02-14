import { Client } from "@/src/types/Client";
import { FaBook, FaPlus } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import Image from "next/image";
import { AddNewQuoteModal } from "@/src/components/client/modal/AddNewQuoteModal";
import { CreateHandbookModal } from "@/src/components/client/modal/CreateHandbookModal";
import { ViewQuoteModal } from "@/src/components/client/modal/ViewQuoteModal";
import { useState } from "react";
import { IconBuilding } from "@tabler/icons-react";

export type ClientCardProps = {
  client: Client;
};

export const ClientCard = ({ client }: ClientCardProps) => {
  console.log("client", client);

  const [modalOpen, setModalOpen] = useState<string>("");

  function handleCreateHandbook() {
    setModalOpen("createHandbook");
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
        className="w-full flex flex-col h-fit bg-white shadow-sm outline outline-1 outline-gray-200 rounded-md p-3"
      >
        <div className="flex items-center">
          {client.icon ? (
            <Image
              src={client.icon} //TODO: provide defaultImage
              alt="Description of the image"
              width={30}
              height={30}
              className="mr-2 rounded-md"
            />
          ) : (
            <IconBuilding />
          )}
          <p>Apple</p>
        </div>
        <div className="text-gray-500 text-sm font-light mb-1">
          <p className="mt-3"> Plans - 9 </p> {/*//TODO:client.plans.length*/}
          <p className="mt-0.5"> Quotes - 72 </p>{" "}
          {/*//TODO:client.quotes.length*/}
          <p className="mt-0.5"> Lives - {client.num_lives} </p>
        </div>
        <div className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-3 text-sm">
          <FaBook className="mr-1" />
          <button onClick={handleCreateHandbook}>Create Handbook</button>
        </div>
        <div className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-1 text-sm">
          <IoEyeSharp className="mr-1" />
          <button onClick={handleViewQuote}>View Quotes</button>
        </div>
        <div className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-1 text-sm">
          <FaPlus className="mr-1" />
          <button onClick={handleAddNewQuote}>New Quote</button>
        </div>
      </div>
      {modalOpen === "createHandbook" && <CreateHandbookModal />}
      {modalOpen === "viewQuote" && <ViewQuoteModal />}
      {modalOpen === "addNewQuote" && <AddNewQuoteModal />}
    </>
  );
};
