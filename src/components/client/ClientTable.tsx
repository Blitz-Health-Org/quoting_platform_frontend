"use client";

import React, {
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { PiListBulletsBold } from "react-icons/pi";
import { BiPlus } from "react-icons/bi";
import { NewClientModal } from "@/src/components/client/modal/NewClient";
import { ClientCard } from "@/src/components/client/ClientCard";
import { UserContext } from "@/src/context/UserContext";
import { ClientType } from "@/src/types/custom/Client";
import { supabase } from "../../supabase";
import { SnackBarContext } from "@/src/context/SnackBarContext";
import { CiShare1 } from "react-icons/ci";
import { useGetUserData } from "@/src/utils/useGetUserData";
import { useRouter } from "next/navigation";

export default function ClientTable({
  setComparisonOpen,
  setSelectedClient,
  selectedClient,
  setModalOpen,
  modalOpen,
}: {
  setComparisonOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedClient: Dispatch<SetStateAction<ClientType>>;
  selectedClient: ClientType;
  setModalOpen: Dispatch<SetStateAction<string>>;
  modalOpen: string;
}) {
  const [clients, setClients] = useState<ClientType[]>([]);
  const {
    userId: [userId, , loading],
  } = useContext(UserContext);
  const { userData, loadingUserData } = useGetUserData();

  const sortedClients = clients
    .filter((client) => client.created_at)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setSnackbar } = useContext(SnackBarContext);
  const router = useRouter();

  const fetchData = async () => {
    let queryIds = [];

    if (userData?.permissions == "admin_org") {
      // Get all the users under the organization
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("organization_id", userData.organization_id);
      if (error) {
        console.log("error", error);
      } else {
        queryIds = data.map((user) => user.user_auth_id);
      }
    } else {
      queryIds = [userId];
    }
    const { data, error } = await supabase
      .from("clients")
      .select()
      .in("user_id", queryIds);

    if (error) {
      return { result: "error", error: error };
    } else {
      console.log("data retrieved", data);
      setClients(data); //TODO: make sure the data recieved matches client type
      return { result: "success", data: data };
    }
  };

  useEffect(() => {
    if (!loading && !loadingUserData) fetchData();
  }, [loading, loadingUserData, userData, userId]);

  const copyUrlToClipboard = () => {
    // Use window.location.href to get the current URL
    const url = window.location.href;

    // Use the Clipboard API to write the text
    navigator.clipboard
      .writeText(url + "?sharing=" + userId)
      .then(() => {
        // Optional: Display a message or call a function to indicate success
        setSnackbar({
          open: true,
          message: "Copied to clipboard!",
          severity: "success",
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
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", client.id);

    if (error) {
      setSnackbar({
        open: true,
        message: "Delete failed",
        severity: "error",
      });
      console.error("Error inserting data:", error);
    } else {
      //UPDATE DATA
      const result = await fetchData();
      if (result.result === "error") {
        setSnackbar({
          open: true,
          message: "Delete failed",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: `${client.name} Deleted!`,
          severity: "success",
        });
      }
    }
  }

  const handleCloseModal = (clientId?: any) => {
    setIsModalOpen(!isModalOpen);
    if (clientId) {
      router.push(`/select?clientId=${clientId}`);
    }
  };

  return (
    <>
      <main className="h-screen overflow-hidden flex-col w-full bg-gray-100 bg-opacity-50 pl-2 pr-6 pt-5 pb-6 text-gray-700">
        <div className="flex w-full items-center mb-4 mt-1 justify-between">
          <div className="flex items-center text-sm md:text-base">
            <PiListBulletsBold className="mr-2" />
            <p className="mr-1">Clients</p>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 h-fit overflow-auto p-0.5">
            {sortedClients.map((client) => {
              return (
                <div key={client.id}>
                  <ClientCard
                    client={client}
                    handleClientDelete={handleClientDelete}
                    setComparisonOpen={setComparisonOpen}
                    setSelectedClient={setSelectedClient}
                    setModalOpen={setModalOpen}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {isModalOpen && (
          <NewClientModal onClose={handleCloseModal} setClients={setClients} />
        )}
      </main>
    </>
  );
}
