"use client";

import React, { useContext, useEffect, useState } from "react";
import "./globals.css";
import { Navbar } from "../components/comparison/Navbar";
import SelectQuotes from "@/src/components/client/SelectQuotes";
import ClientTable from "@/src/components/client/ClientTable";
import { UserContext } from "@/src/context/UserContext";
import { ClientType } from "@/src/types/custom/Client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/src/supabase";
import { AddQuote } from "../components/client/modal/AddQuote";
import { SnackbarAlert } from "../components/ui/SnackbarAlert";
import { SnackBarContext } from "../context/SnackBarContext";
import { ModalContext } from "../context/ModalContext";

export default function Home() {
  const {
    userId: [userId, , loading],
  } = useContext(UserContext);

  const [taskStatus, setTaskStatus] = useState(null);

  const [comparisonOpen, setComparisonOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<ClientType>(
    undefined as unknown as ClientType,
  );

  const [modalOpen, setModalOpen] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchClient = async (clientId: any) => {
    try {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (clientError) throw clientError;

      setSelectedClient(clientData);

      console.log("Client Data", clientData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally handle errors, such as setting an error state or showing a notification
    }
  };

  useEffect(() => {
    const clientId = searchParams.get("clientId");
    console.log(clientId);

    if (clientId) {
      fetchClient(clientId);
      setComparisonOpen(true);
    }
  }, [searchParams]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // default severity
  });

  return (
    // <SocketProvider>
    <SnackBarContext.Provider value={{ setSnackbar }}>
      <div className="w-full h-full flex flex-row bg-white">
        <Navbar selected="Quotes" />

        <div className="w-full md:w-6/7">
          {/* <main className="h-screen overflow-hidden flex-col w-full bg-gray-100 bg-opacity-50 pl-2 pr-6 pt-5 pb-6 text-gray-700">
          <div className="flex w-full items-center mb-4 mt-1 justify-between">
            <div className="flex items-center text-sm md:text-base">
              <PiListBulletsBold className="mr-2" />
              <p className="mr-1">Quoting</p>
              <p className="mr-1 text-gray-400 text-xs">•</p>
              <p className="mr-1 text-gray-400">({clients.length})</p>
            </div>
            <div className="flex items-center">
              <div className="text-sm md:text-base mr-1 outline outline-1 outline-gray-200 py-1 px-2 rounded-md flex items-center justify-center hover:bg-gray-100/80 cursor-pointer">
                <CiShare1 className="mr-2" />
                <button onClick={copyUrlToClipboard}>Share Dashboard</button>
              </div>
              <div
                onClick={handleNewClientClick}
                className="text-sm md:text-base mr-1 outline outline-1 outline-gray-200 bg-neutral-600/90 py-1 px-2 rounded-md flex items-center justify-center ml-1 hover:bg-neutral-600 cursor-pointer"
              >
                <BiPlus className="mr-2 text-gray-100" />
                <p className="text-gray-100">New Client</p>
              </div>
            </div>
          </div>
          <div className="rounded-md w-full flex-col h-full pb-12 overflow-y-scroll">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 h-fit overflow-scroll p-0.5">
              {clients.map((client) => {
                return (
                  <>
                    <ClientCard
                      key={client.id}
                      client={client}
                      setOpenSnackbarShare={setSnackbar}
                      handleClientDelete={handleClientDelete}
                    />
                  </>
                );
              })}
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
        </main> */}

          <ClientTable
            setComparisonOpen={setComparisonOpen}
            setSelectedClient={setSelectedClient}
            selectedClient={selectedClient}
            setModalOpen={setModalOpen}
            modalOpen={modalOpen}
          />
        </div>

        {modalOpen === "addNewQuote" && (
          <AddQuote
            onClose={() => {
              setModalOpen("");
            }}
            setModalOpen={setModalOpen}
            client={selectedClient}
            type={"Main"}
          />
        )}

        <SnackbarAlert
          openSnackbarShare={snackbar.open}
          setOpenSnackbarShare={setSnackbar}
          snackbar={snackbar}
        />
      </div>
    </SnackBarContext.Provider>
  );
}
