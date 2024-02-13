"use client";

import React, { useState } from "react";
import "./globals.css";
import { Header } from "../components/Header";
import { PiListBulletsBold } from "react-icons/pi";
import { RiArrowDropDownLine } from "react-icons/ri";
import Apple from "../../public/Apple.jpg";
import BlumeLogo from "../../public/BlumeLogo.png";
import Image from "next/image";
import { FaBook } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { CiShare1 } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { BiPlus } from "react-icons/bi";
import { useDropzone } from "react-dropzone";
import { createClient } from "@supabase/supabase-js";
import { Snackbar, Alert } from "@mui/material";
import { MdUpload } from "react-icons/md";

interface stateProps {
  files: File[];
  uploadStatus: string;
}

const supabase = createClient(
  "https://ifaekiywtbedsipmwtkr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYWVraXl3dGJlZHNpcG13dGtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjgyNjU1NCwiZXhwIjoyMDIyNDAyNTU0fQ.37mTjcmzwBWCIm1RIeaREROrnoEFSYAXyFrY48NDCsA",
);

const Modal = ({ onClose, setOpenSnackbarShare }: any) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<stateProps>({
    files: [],
    uploadStatus: "",
  });

  const onDrop = (acceptedFiles: File[]) => {
    setState({ ...state, files: acceptedFiles });
  };

  const handleUpload = async () => {
    if (state.files.length > 0) {
      const promises = state.files.map(async (file: any) => {
        const randomDigit = Math.floor(Math.random() * 1024); // Generate random 8-bit digit
        const newFileName = `${file.name}_${randomDigit}`; // Append random digit to the file name

        const { data, error } = await supabase.storage
          .from("images")
          .upload(`path/${newFileName}`, file);

        if (error) {
          console.error(`Error uploading file ${newFileName}:`, error);
          return { success: false, fileName: newFileName };
        } else {
          return { success: true, fileName: newFileName };
        }
      });

      const results = await Promise.all(promises);
      const successUploads = results.filter((result) => result.success);

      if (successUploads.length === state.files.length) {
        setState({
          files: [],
          uploadStatus: "Upload successful!",
        });

        // Additional actions after successful upload
      } else {
        setState({
          ...state,
          uploadStatus: "Upload failed for some files. Please try again.",
        });
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true, // Allow multiple file uploads
  });

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setOpenSnackbarShare(true); // Use prop to set state

    // Send data to Supabase
    try {
      const { data, error } = await supabase
        .from("quoting_clients") // Replace with your actual table name
        .upsert([
          {
            name,
            password,
          },
        ]);

      if (error) {
        console.error("Error inserting data:", error);
      } else {
        console.log("Data inserted successfully:", data);
        onClose(); // Close the modal after successful submission
      }
    } catch (error) {
      console.error("Error connecting to Supabase:", error);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center`}
      style={{ backdropFilter: "blur(2px)" }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-4 rounded-md w-1/2 md:w-1/3 lg:1/4">
        <div className="flex">
          <Image
            src={BlumeLogo}
            alt="Description of the image"
            width={30}
            height={30}
            className="mr-2 rounded-md"
          />
          <p className="text-2xl">Add a Client</p>
        </div>
        <form onSubmit={handleSubmit}>
          <p className="text-sm mt-4">Name</p>
          <input
            placeholder="Acme Corporation Inc."
            className="w-full border border-1 border-gray-200 rounded-md p-2 text-sm mb-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-sm mt-2">Lives (Optional)</p>
          <input
            type="password"
            placeholder="2,438"
            className="w-full border border-1 border-gray-200 rounded-md p-2 text-sm mt-1 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="modal-body">
            {/* File Upload Section */}
            <div className="mb-6 flex flex-col items-center justify-center">
              <div
                {...getRootProps()}
                className={`p-6 mb-2 mt-2 drop-shadow-sm outline outline-1 outline-gray-400/65 hover:outline-black w-full ${
                  isDragActive ? "bg-gray-200" : "bg-gray-100"
                }`}
                style={{ borderRadius: "0.25rem" }}
              >
                <div className="flex items-center justify-center mb-4">
                  <MdUpload className="h-8 w-8" />
                </div>
                <input {...getInputProps()} />
                <h1 className="text-lg mb-4 text-center">
                  {isDragActive
                    ? "Drop the files here"
                    : "Select or Drag-In Files"}
                </h1>
                {state.files.length > 0 && (
                  <div className="text-center mb-4">
                    {state.files.map((file, index) => (
                      <p className="truncate" key={index}>
                        {file.name}
                      </p>
                    ))}
                  </div>
                )}
                {state.uploadStatus && (
                  <div className="text-center mb-4 text-slate-600">
                    {state.uploadStatus}
                  </div>
                )}
              </div>
              <button
                onClick={handleUpload}
                className="w-full bg-slate-800 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                disabled={state.files.length === 0}
              >
                Upload
              </button>
            </div>
          </div>

          <div className="flex w-full justify-end">
            <button
              className="mr-2 outline outline-1 outline-gray-200 px-2 py-1 rounded-sm"
              type="button"
              onClick={onClose}
            >
              Close Modal
            </button>
            <button
              className="outline outline-1 outline-gray-200 px-2 py-1 bg-blue-600/90 text-gray-100 rounded-sm"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSnackbarShare, setOpenSnackbarShare] = useState(false); // Move state to Home component

  const handleNewClientClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
              <div className="text-sm md:text-base mr-1 outline outline-1 outline-gray-200 py-1 px-2 rounded-md flex items-center justify-center mr-1 hover:bg-gray-100/80 cursor-pointer">
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
              <div className="w-full flex flex-col h-fit bg-white shadow-sm outline outline-1 outline-gray-200 rounded-md p-3">
                <div className="flex items-center">
                  <Image
                    src={Apple}
                    alt="Description of the image"
                    width={30}
                    height={30}
                    className="mr-2 rounded-md"
                  />
                  <p>Apple</p>
                </div>
                <div className="text-gray-500 text-sm font-light mb-1">
                  <p className="mt-3"> Plans - 9 </p>
                  <p className="mt-0.5"> Quotes - 72 </p>
                  <p className="mt-0.5"> Lives - 28,592 </p>
                </div>
                <div className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-3 text-sm">
                  <FaBook className="mr-1" />
                  <p>Create Handbook</p>
                </div>
                <div className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-1 text-sm">
                  <IoEyeSharp className="mr-1" />
                  <p>View Quotes</p>
                </div>
                <div className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-1 text-sm">
                  <FaPlus className="mr-1" />
                  <p>New Quote</p>
                </div>
              </div>
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
