"use client";

import React, { useContext, useEffect, useState } from "react";
import "./globals.css";
import { Header } from "../components/Header";
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
import { Modal } from "@/src/components/client/modal/NewClientModal";
import { MdUpload } from "react-icons/md";
import { supabase } from "@/src/supabase";
import { UserContext } from "@/src/context/UserContext";
import { Database } from "@/src/types/database/database.types";
import { ClientCard } from "@/src/components/client/ClientCard";
import { Client } from "@/src/types/Client";

export default function Home() {
  const {
    userId: [userId],
  } = useContext(UserContext);

  const [clients, setClients] = useState<Client[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSnackbarShare, setOpenSnackbarShare] = useState(false); // Move state to Home component
  console.log("client", clients);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("clients").select();
      // .eq("user_id", userId);
      console.log(`helllooo`, data);

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

  return (
    <div className="w-full h-full flex flex-row bg-white">
      <Header selected="Policies" />

      <div className="w-full md:w-6/7">
        <main className="h-screen flex-col w-full bg-gray-100 bg-opacity-50 pl-2 pr-6 pt-5 pb-6 overflow-hidden text-gray-700">
          <div className="flex w-full items-center mb-4 mt-1 justify-between">
            <div className="flex items-center text-sm md:text-base">
              <PiListBulletsBold className="mr-2" />
              <p className="mr-1">Quoting</p>
              <p className="mr-1 text-gray-400 text-xs">•</p>
              <p className="mr-1 text-gray-400">(5)</p>
              <RiArrowDropDownLine className="text-gray-400" />
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
                    <ClientCard key={client.id} client={client} />
                  </>
                );
              })}
            </div>
          </div>

          {isModalOpen && (
            <Modal
              setOpenSnackbarShare={setOpenSnackbarShare}
              onClose={handleCloseModal}
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
