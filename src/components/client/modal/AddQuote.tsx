import { supabase } from "@/src/supabase";
import { useDropzone } from "react-dropzone";
import { MdUpload } from "react-icons/md";
import React, { useState, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import BlumeLogo from "@/public/BlumeLogo.png";
import { FaX } from "react-icons/fa6";
import { v4 as uuid } from "uuid";
import { ClientType } from "@/src/types/custom/Client";

type AddQuoteProps = {
  onClose: () => void;
  client: any;
  setModalOpen: any;
  setOpenSnackbarShare: ({
    open,
    message,
    severity,
  }: {
    open: boolean;
    message: string;
    severity: string;
  }) => void;
  setComparisonOpen: Dispatch<SetStateAction<boolean>>
  setSelectedClient: Dispatch<SetStateAction<ClientType>>
};

export const AddQuote = ({
  onClose,
  client,
  setOpenSnackbarShare,
  setModalOpen,
  setComparisonOpen,
  setSelectedClient
}: AddQuoteProps) => {
  const links: string[] = [];

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click was outside the modal content
    if (e.target === e.currentTarget) {
      onClose(); // Close the modal
    }
  };

  const [files, setFiles] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setOpenSnackbarShare({
        open: true,
        message: "Please upload a file",
        severity: "error",
      });
      return;
    }

    const errFiles = [];
    const successfulFileUrls: string[] = [];
    for (const file of files) {
      try {
        const fileName = uuid();
        await supabase.storage.from("images").upload(fileName, file);
        await supabase
          .from("quotes") // Replace with your actual Supabase table name
          .upsert({
            client_id: client.id,
            file_urls: fileName,
            file_name: file.name,
          });

        successfulFileUrls.push(fileName);
      } catch {
        errFiles.push(file.name);
      }
    }
    if (errFiles.length) {
      setOpenSnackbarShare({
        open: true,
        message: `Error occurred for the following files: ${errFiles.join(", ")}`,
        severity: "error",
      });
      return;
    } else {
      setOpenSnackbarShare({
        open: true,
        message: `Files uploaded!`,
        severity: "success",
      });
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/parse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ successfulFileUrls }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Parse the JSON from the response

      // Now you can use 'data' in your application
      console.log("respoinse", data); // For example, logging the data

      // If you're using React state, for example:
      // this.setState({ parsedData: data });
      // Or using hooks:
      // setParsedData(data);
    } catch (error) {
      console.error("Fetch error: ", error);
    }

    setSelectedClient(client);
    setComparisonOpen(true);
  };

  // const handleUpload = async () => {
  //   const pdfFiles = state.files.filter(
  //     (file) => file.type === "application/pdf",
  //   );
  //   const nonPDFs = state.files.filter(
  //     (file) => file.type !== "application/pdf",
  //   );
  //   if (pdfFiles.length === 0) {
  //     setOpenSnackbarShare({
  //       open: true,
  //       message: "Please upload a PDF file!",
  //       severity: "error",
  //     });
  //     return;
  //   } else {
  //     setState({ ...state, files: pdfFiles });
  //   }
  //   if (state.files.length === 0) {
  //     setOpenSnackbarShare({
  //       open: true,
  //       message: "Please upload a file!",
  //       severity: "error",
  //     });
  //   }
  //   if (state.files.length > 0) {
  //     const paths: string[] = [];
  //     const fileNames: string[] = [];

  //     const promises = state.files.map(async (file) => {
  //       const randomDigit = Math.floor(Math.random() * 1024);
  //       const newFileName = `${file.name}_${randomDigit}`;

  //       const { data, error } = await supabase.storage
  //         .from("images")
  //         .upload(`path/${newFileName}`, file);

  //       const path = data?.path;

  //       if (error) {
  //         console.error(`Error uploading file ${newFileName}:`, error);
  //         return { success: false, fileName: newFileName };
  //       } else {
  //         console.log("Downloadable URL:", data);
  //         // Append the path to the temporary array if it's not already in the list
  //         if (path && !state.filesPaths.includes(path)) {
  //           paths.push(path);
  //         }
  //         if (newFileName) {
  //           fileNames.push(file.name);
  //         }
  //         return { success: true, fileName: newFileName, path };
  //       }
  //     });

  //     const results = await Promise.all(promises);
  //     const successUploads = results.filter((result) => result.success);

  //     if (successUploads.length === state.files.length) {
  //       // Combine old paths and new paths, avoiding duplicates

  //       setState((prevState) => ({
  //         ...prevState,
  //         files: [],
  //         uploadStatus: "Upload successful!",
  //       }));

  //       // Update Supabase table with the new file paths
  //       const insertPromises = paths.map(async (path, index) => {
  //         const { data: insertData, error: insertError } = await supabase
  //           .from("quotes") // Replace with your actual Supabase table name
  //           .upsert({
  //             client_id: client.id,
  //             file_urls: path,
  //             file_name: fileNames[index],
  //           });

  //         if (insertError) {
  //           console.error(
  //             "Error inserting row into Supabase table:",
  //             insertError,
  //           );
  //           return { success: false, fileName: path };
  //         } else {
  //           return { success: true, fileName: path };
  //         }
  //       });

  //       const insertResults = await Promise.all(insertPromises);

  //       if (insertResults.every((result) => result.success)) {
  //         console.log("Rows inserted into Supabase successfully");
  //         if (nonPDFs.length >= 0) {
  //           setOpenSnackbarShare({
  //             open: true,
  //             message: "Only your PDF files were uploaded.",
  //             severity: "info",
  //           });
  //         } else {
  //           setOpenSnackbarShare({
  //             open: true,
  //             message: "Quotes Added",
  //             severity: "success",
  //           });
  //         }
  //         setModalOpen("viewQuote");
  //       } else {
  //         console.error("Error inserting some rows into Supabase");
  //       }
  //     } else {
  //       setState({
  //         ...state,
  //         uploadStatus: "Upload failed for some files. Please try again.",
  //       });
  //     }
  //   }
  // };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true, // Allow multiple file uploads
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center modal-overlay z-50 bg-gray-800 bg-opacity-50"
      style={{ backdropFilter: "blur(3px)" }}
    >
      <div className="bg-white p-8 rounded-md max-w-md w-full h-fit modal-content">
        <div className="flex justify-between items-center mb-4 modal-header">
          <div className="flex">
            <Image
              src={BlumeLogo}
              alt="Description of the image"
              width={30}
              height={30}
              className="mr-2 rounded-md"
            />
            <p className="text-2xl">Upload Quotes</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaX />
          </button>
        </div>
        <label className="mr-2">Choose a plan:</label>
          <select className="outline outline-1 outline-gray-300 rounded-sm" name="plan" id="plan">
            <option value="bcbs_tx_aca">BCBS TX ACA</option>
            <option value="aetna">Aetna</option>
            <option value="chamber_smart">Chamber Smart</option>
            <option value="anthem">Anthem</option>
            <option value="uhc_aca">UHC ACA</option>
            <option value="uhc_lf">UHC Level Funded</option>
            <option value="other">Other</option>
          </select>
        <div className="modal-body">
          {/* File Upload Section */}
          <div className="flex flex-col items-center justify-center cursor-pointer">
            <div
              {...getRootProps()}
              className={`p-6 mb-2 mt-2 drop-shadow-sm outline outline-1 outline-gray-400/65 hover:outline-black w-full ${
                isDragActive ? "bg-gray-200/50" : "bg-gray-100/50"
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
                  : "Select or Drag-In Quotes"}
              </h1>
              {files.length > 0 && (
                <div className="text-center mb-4">
                  {files.map((file, index) => (
                    <p className="truncate" key={index}>
                      {file.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleUpload}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer"
            >
              Upload
            </button>
            <p className="text-xs text-center text-gray-700 mb-1 mt-3">
              We use bank-level security to encrypt and process your statements.
              For more information about our privacy measures,&nbsp;
              <a
                className="text-slate-900 underline"
                href="mailto:founders@tryblitz.ai?subject=Security%20Inquiry"
              >
                email us
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
