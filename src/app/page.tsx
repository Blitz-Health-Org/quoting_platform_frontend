"use client";

import React, { useContext, useEffect, useState } from "react";
import "./globals.css";
import { Navbar } from "../components/comparison/Navbar";
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
import SelectQuotes from "@/src/components/client/SelectQuotes";
import Standard from "@/src/components/client/Standard";
import { UserContext } from "@/src/context/UserContext";
import { ClientType } from "@/src/types/custom/Client";
import { useRouter } from "next/navigation";
import { SnackbarAlert } from "../components/ui/SnackbarAlert";
import error from "next/error";
import { supabase } from "../supabase";
import io from "socket.io-client";

export default function Home() {
  const {
    userId: [userId, , loading],
  } = useContext(UserContext);
  const [taskStatus, setTaskStatus] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!loading && !userId) {
      router.push("sign-in");
    }
  }, [userId, router, loading]);

  useEffect(() => {
    if (!loading) {
      // Connect to the Socket.IO server
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!, {
        path: "/socket.io",
        transports: ["websocket"],
      });

      // Listen for 'task_complete' events
      socket.on("task_complete", (data) => {
        console.log("Task Complete:", data);
        setTaskStatus(data);
      });

      // Listen for 'task_status' events
      socket.on("task_status", (data) => {
        console.log("Task Status:", data);
        setTaskStatus(data);
      });

      return () => {
        console.log("rip");
        socket.off("task_complete");
        socket.off("task_status");
        socket.close();
      };
    }
  }, [loading]);

  const [comparisonOpen, setComparisonOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<ClientType>(
    undefined as unknown as ClientType,
  );

  // const [clients, setClients] = useState<ClientType[]>([]);

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const [snackbar, setSnackbar] = useState({
  //   open: false,
  //   message: "",
  //   severity: "info", // default severity
  // });

  useEffect(() => {
    if (!loading) {
      // Connect to the Socket.IO server
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!, {
        path: "/socket.io",
        transports: ["websocket"],
      });

      // Listen for 'task_complete' events
      socket.on("task_complete", (data) => {
        console.log("Task Complete:", data);
        setTaskStatus(data);
      });

      // Listen for 'task_status' events
      socket.on("task_status", (data) => {
        console.log("Task Status:", data);
        setTaskStatus(data);
      });

      return () => {
        console.log("rip");
        socket.off("task_complete");
        socket.off("task_status");
        socket.close();
      };
    }
  }, [loading]);

  // const [clients, setClients] = useState<ClientType[]>([]);

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const [snackbar, setSnackbar] = useState({
  //   open: false,
  //   message: "",
  //   severity: "info", // default severity
  // });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const { data, error } = await supabase.from("clients").select();
  //     // .eq("user_id", userId);

  //     if (error) {
  //       alert("Error updating data");
  //     } else {
  //       setClients(data); //TODO: make sure the data recieved matches client type
  //     }
  //   };
  //   fetchData();
  // }, [userId]);

  // const copyUrlToClipboard = () => {
  //   // Use window.location.href to get the current URL
  //   const url = window.location.href;

  //   // Use the Clipboard API to write the text
  //   navigator.clipboard
  //     .writeText(url)
  //     .then(() => {
  //       // Optional: Display a message or call a function to indicate success
  //       setSnackbar({
  //         open: true,
  //         message: "Copied to clipboard!",
  //         severity: "success",
  //       });
  //     })
  //     .catch((err) => {
  //       // Optional: Handle any errors
  //       console.error("Failed to copy URL to clipboard", err);
  //     });
  // };

  // const handleNewClientClick = () => {
  //   setIsModalOpen(!isModalOpen);
  // };

  // async function handleClientDelete(client: ClientType) {
  //   // SEND DATA
  //   try {
  //     const { error } = await supabase
  //       .from("clients")
  //       .delete()
  //       .eq("id", client.id);

  //     if (error) {
  //       setSnackbar({
  //         open: true,
  //         message: "Delete failed",
  //         severity: "error",
  //       });
  //       console.error("Error inserting data:", error);
  //     } else {
  //       //UPDATE DATA
  //       try {
  //         const { data, error } = await supabase.from("clients").select();
  //         if (error) {
  //           alert("Error retrieving data");
  //         } else {
  //           setClients(data);
  //           console.log("Data retrieved successfully:", data);
  //         }
  //       } catch (error) {
  //         setSnackbar({
  //           open: true,
  //           message: "Delete failed",
  //           severity: "error",
  //         });
  //       }
  //       setSnackbar({
  //         open: true,
  //         message: `${client.name} Deleted!`,
  //         severity: "success",
  //       });
  //     }
  //   } catch (error) {
  //     setSnackbar({
  //       open: true,
  //       message: "Delete failed",
  //       severity: "error",
  //     });
  //   }
  // }

  // const handleCloseModal = () => {
  //   setIsModalOpen(!isModalOpen);
  // };

  if (loading) {
    return <></>;
  }

  return (
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

        {comparisonOpen === false ? (
          <Standard
            setComparisonOpen={setComparisonOpen}
            setSelectedClient={setSelectedClient}
          />
        ) : (
          <SelectQuotes
            selectedClient={selectedClient}
            setComparisonOpen={setComparisonOpen}
            setSelectedClient={setSelectedClient}
          />
        )}
      </div>
    </div>
  );
}
