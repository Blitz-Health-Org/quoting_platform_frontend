"use client";

import React, { useContext, useEffect, useState } from "react";
import "./globals.css";
import { Navbar } from "../components/Navbar";
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
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface stateProps {
  files: File[];
  uploadStatus: string;
}

const supabase = createClient(
  "https://xabksrsyvpqlikxxwfgi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhYmtzcnN5dnBxbGlreHh3ZmdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4NTM4NzgsImV4cCI6MjAyMzQyOTg3OH0.rUzmHolfckNk_wqKcNcmr0CD5C1hjt8iOShk3zM-uVw",
);

export default function Home() {
  const {
    userId: [userId, , loading],
  } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !userId) {
      router.push("sign-in");
    }
  }, [userId, router, loading]);

  const [clients, setClients] = useState<ClientType[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSnackbarShare, setOpenSnackbarShare] = useState(false); // Move state to Home component

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("clients").select();
      // .eq("user_id", userId);

      if (error) {
        console.error(`Error fetching client data:`, error);
      } else {
        setClients(data); //TODO: make sure the data recieved matches client type
      }
    };
    fetchData();
  }, [userId]);

  const handleNewClientClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (loading) {
    return <></>;
  }

  return (
    <div className="w-full h-full flex flex-row bg-white">
      <Navbar selected="Quotes" />

      <div className="w-full md:w-6/7">
        <main className="h-screen flex-col w-full bg-gray-100 bg-opacity-50 pl-2 pr-6 pt-5 pb-6 overflow-hidden text-gray-700">
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
                <p>Share Dashboard</p>
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

          <div className="rounded-md w-full h-full flex-col overflow-scroll">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 h-fit overflow-scroll p-0.5">
              {clients.map((client) => {
                return (
                  <>
                    <ClientCard
                      key={client.id}
                      client={client}
                      setOpenSnackbarShare={setOpenSnackbarShare}
                    />
                  </>
                );
              })}
            </div>
          </div>

          {isModalOpen && (
            <NewClientModal
              setOpenSnackbarShare={setOpenSnackbarShare}
              onClose={handleCloseModal}
              setClients={setClients}
            />
          )}
          <Snackbar
            key={`4`}
            open={openSnackbarShare}
            autoHideDuration={4000}
            onClose={() => setOpenSnackbarShare(false)}
          >
            <Alert
              onClose={() => setOpenSnackbarShare(false)}
              severity="success"
              variant="filled"
            >
              Client added.
            </Alert>
          </Snackbar>
        </main>
      </div>
    </div>
  );
}
