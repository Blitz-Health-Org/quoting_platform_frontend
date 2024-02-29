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
    <div className="w-full h-full flex flex-row bg-white">
      <Navbar selected="Quotes" />

      <div className="w-full md:w-6/7">
        {comparisonOpen === false || selectedClient === undefined ? (
          <ClientTable
            setComparisonOpen={setComparisonOpen}
            setSelectedClient={setSelectedClient}
            selectedClient={selectedClient}
            setModalOpen={setModalOpen}
            modalOpen={modalOpen}
          />
        ) : (
          <SelectQuotes
            selectedClient={selectedClient}
            setComparisonOpen={setComparisonOpen}
            setSelectedClient={setSelectedClient}
            setModalOpen={setModalOpen}
          />
        )}
      </div>

      {modalOpen === "addNewQuote" && (
        <AddQuote
          onClose={() => {
            setModalOpen("");
            if (!comparisonOpen) {
              setSelectedClient(undefined as unknown as ClientType);
            }
          }}
          setModalOpen={setModalOpen}
          client={selectedClient}
          setOpenSnackbarShare={setSnackbar}
          setComparisonOpen={setComparisonOpen}
          setSelectedClient={setSelectedClient}
        />
      )}

      <SnackbarAlert
        openSnackbarShare={snackbar.open}
        setOpenSnackbarShare={setSnackbar}
        snackbar={snackbar}
      />
    </div>
    // </SocketProvider>
  );
}
