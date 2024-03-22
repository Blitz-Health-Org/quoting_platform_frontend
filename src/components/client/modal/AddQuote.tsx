import { supabase } from "@/src/supabase";
import { useDropzone } from "react-dropzone";
import { MdUpload } from "react-icons/md";
import React, { useState, Dispatch, SetStateAction, useContext } from "react";
import Image from "next/image";
import BlumeLogo from "@/public/BlumeLogo.png";
import { FaX } from "react-icons/fa6";
import { v4 as uuid } from "uuid";
import { ClientType } from "@/src/types/custom/Client";
import { SnackBarContext } from "@/src/context/SnackBarContext";
import { useRouter } from "next/navigation";
import { UserContext } from "@/src/context/UserContext";
import TabHeader from "../../ui/TabHeader";
import router from "next/router";

const TABS = ["Medical", "Ancillary"];

type AddQuoteProps = {
  onClose: () => void;
  client: any;
  setModalOpen: any;
  type: any;
};

export const AddQuote = ({
  onClose,
  client,
  setModalOpen,
  type,
}: AddQuoteProps) => {
  const links: string[] = [];

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click was outside the modal content
    if (e.target === e.currentTarget) {
      onClose(); // Close the modal
    }
  };

  const router = useRouter();
  const { setSnackbar } = useContext(SnackBarContext);
  const [file, setFile] = useState<File | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("bcbs_tx_aca");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [customRange, setCustomRange] = useState("");
  const [isRangeValid, setIsRangeValid] = useState(true);
  const [rangeSelection, setRangeSelection] = useState("all"); // Dropdown selection state
  const [currentTab, setCurrentTab] = useState<string>("Medical");
  const [prevCurrentTab, setPrevCurrentTab] = useState<string>(currentTab);

  if (prevCurrentTab !== currentTab) {
    setPrevCurrentTab(currentTab);

    if (currentTab === "Medical") {
      setSelectedPlan("bcbs_tx_aca");
    }

    if (currentTab === "Ancillary") {
      setSelectedPlan("principal_ancillary");
    }
  }

  console.log("selectedPlan", selectedPlan);

  const {
    userId: [userId],
  } = useContext(UserContext);

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  function validateCustomRange(range: string) {
    const ranges = range
      .split(",")
      .map((part) => {
        const numbers = part.trim().split("-").map(Number);
        // If it's a single number, duplicate it to make a range [number, number]
        if (numbers.length === 1 && !isNaN(numbers[0])) {
          return [numbers[0], numbers[0]];
        }
        // If it's a proper range and both numbers are valid, return the range
        else if (
          numbers.length === 2 &&
          !isNaN(numbers[0]) &&
          !isNaN(numbers[1])
        ) {
          return numbers;
        }
        // If neither, return null to indicate invalid input
        return null;
      })
      .filter(Boolean); // Filter out any null entries due to invalid input

    // Check if any parsing resulted in null, indicating invalid format
    if (ranges.length === 0 || ranges.includes(null)) {
      setIsRangeValid(false);
      return [];
    } else {
      setIsRangeValid(true);
      return ranges; // Returns a list of tuples like [[1, 5], [8, 8], [11, 13]]
    }
  }

  const handleUpload = async (ranges?: number[][]) => {
    if (!file) {
      setSnackbar({
        open: true,
        message: "Please upload a file",
        severity: "error",
      });
      return;
    }
    const errFiles = [] as string[];
    const successfulFileUrls: string[] = [];
    const fileId = uuid();
    try {
      console.log("selectedPlan", selectedPlan);
      const fileName = `${selectedPlan}/${fileId}/whole`;
      await supabase.storage.from("images").upload(fileName, file);

      const { data } = supabase.storage.from("images").getPublicUrl(fileName);

      if (!data?.publicUrl) {
        throw new Error("No url found for file");
      }

      // const fileUrl = data.publicUrl;

      // await supabase
      //   .from("quotes") // Replace with your actual Supabase table name
      //   .upsert({
      //     client_id: client.id,
      //     file_url: fileUrl,
      //     file_name: file.name,
      //   });

      // Send the fileName instead of fileUrl to backend so we can parse out the carrier name
      successfulFileUrls.push(fileName);
    } catch {
      errFiles.push(file.name);
    }

    if (errFiles.length) {
      setSnackbar({
        open: true,
        message: `Error occurred for the following files: ${errFiles.join(", ")}`,
        severity: "error",
      });
      return;
    } else {
      // setSnackbar({
      //   open: true,
      //   message: `Your files are uploading! They can take 2-5 minutes to populate based on size and existing backlog.`,
      //   severity: "success",
      // });
    }

    try {
      console.log("RUNNING ONCE");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/parse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            successfulFileUrls,
            client: client,
            userId: userId,
            ranges: ranges,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Parse the JSON from the response

      // If you're using React state, for example:
      // this.setState({ parsedData: data });
      // Or using hooks:
      // setParsedData(data);
    } catch (error) {
      console.error("Fetch error: ", error);
    }
    if (type === "Main") {
      router.push(`/select?clientId=${client.id}`);
    }
    setModalOpen("");
    setIsProcessing(false);
  };

  // const handleUpload = async () => {
  //   const pdfFiles = state.files.filter(
  //     (file) => file.type === "application/pdf",
  //   );
  //   const nonPDFs = state.files.filter(
  //     (file) => file.type !== "application/pdf",
  //   );
  //   if (pdfFiles.length === 0) {
  //     setSnackbar({
  //       open: true,
  //       message: "Please upload a PDF file!",
  //       severity: "error",
  //     });
  //     return;
  //   } else {
  //     setState({ ...state, files: pdfFiles });
  //   }
  //   if (state.files.length === 0) {
  //     setSnackbar({
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
  //           setSnackbar({
  //             open: true,
  //             message: "Only your PDF files were uploaded.",
  //             severity: "info",
  //           });
  //         } else {
  //           setSnackbar({
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
    multiple: false, // Allow multiple file uploads
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
        <TabHeader
          tabs={TABS}
          titles={["Medical", "Ancillary"]}
          selectedTab={currentTab}
          setSelectedTab={setCurrentTab}
        />
        {currentTab === "Medical" && (
          <>
            <div className="flex flex-col">
              <label className="mr-2 text-sm mb-1">Carrier</label>
              <select
                className="bg-gray-100 hover:cursor-pointer hover:outline-gray-400 outline outline-1 outline-gray-400/80 rounded-sm px-2 py-1"
                name="plan"
                id="plan"
                onChange={(e) => {
                  console.log("e", e.target.value);
                  setSelectedPlan(e.target.value);
                }}
              >
                <option value="bcbs_tx_aca">BCBS TX ACA</option>
                <option value="aetna">Aetna</option>
                <option value="chamber_smart">Chamber Smart</option>
                <option value="anthem">Anthem</option>
                <option value="uhc_aca">UHC ACA</option>
                <option value="uhc_lf">UHC Level Funded</option>
                <option value="cigna">Cigna</option>
                <option value="bcbs_mt">BCBS Montana</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col items-start justify-center w-full my-1 gap-1 mb-2">
              <p className="mr-2 text-sm mt-2">Page Range</p>
              <div className="flex gap-2 w-full">
                <select
                  className="bg-gray-100 px-2 rounded-sm w-full drop-shadow-sm outline outline-1 h-8 outline-gray-400/80 hover:outline-gray-400"
                  value={rangeSelection}
                  onChange={(e) => {
                    setRangeSelection(e.target.value);
                  }}
                >
                  <option value="all" className="w-full">
                    All
                  </option>
                  <option value="custom" className="w-1/2">
                    Custom
                  </option>
                </select>
                {rangeSelection === "custom" && (
                  <>
                    <input
                      type="text"
                      className="bg-gray-100 px-2 h-8 drop-shadow-sm outline outline-1 outline-gray-400/80 hover:outline-gray-400 text-sm rounded-sm w-full"
                      placeholder="e.g., 1-5, 8, 11-13"
                      onChange={(e) => {
                        if (e.target.value && e.target.value.trim()) {
                          const newValue = e.target.value.trim();
                          setCustomRange(newValue);
                          validateCustomRange(newValue);
                        }
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            {rangeSelection === "custom" && !isRangeValid && (
              <div className="text-red-500 text-xs mb-4">
                Please enter a valid range format (e.g., 1-5, 8, 11-13).
              </div>
            )}
            <div className="modal-body">
              {/* File Upload Section */}
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent the default form submission
                  setIsProcessing(true);
                  if (rangeSelection === "all") {
                    handleUpload();
                  } else {
                    const ranges = validateCustomRange(customRange);
                    if (!isProcessing && ranges.length) {
                      handleUpload(ranges as number[][]); // Proceed with uploading
                    }
                  }
                }}
              >
                <div className="flex flex-col items-center justify-center cursor-pointer">
                  <div
                    {...getRootProps()}
                    className={`p-6 mb-2 mt-2 drop-shadow-sm outline outline-1 outline-gray-400/80 hover:outline-gray-400 w-full ${
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
                    {file && (
                      <div className="text-center mb-4">
                        <p className="truncate">{file.name}</p>
                      </div>
                    )}
                  </div>
                  {/* <div className="flex items-center my-4 gap-3">
                <p>Page Range:</p>
                <select
                  className="outline outline-1 outline-gray-300 rounded-sm"
                  value={rangeSelection}
                  onChange={(e) => {
                    setRangeSelection(e.target.value);
                  }}
                >
                  <option value="all">All</option>
                  <option value="custom">Custom</option>
                </select>
                {rangeSelection === "custom" && (
                  <>
                    <input
                      type="text"
                      className="h-5 outline outline-1 outline-gray-300 text-sm rounded-sm"
                      placeholder="e.g., 1-5, 8, 11-13"
                      onChange={(e) => {
                        if (e.target.value && e.target.value.trim()) {
                          const newValue = e.target.value.trim();
                          setCustomRange(newValue);
                          validateCustomRange(newValue);
                        }
                      }}
                    />
                  </>
                )}
              </div>
              {rangeSelection === "custom" && !isRangeValid && (
                <div className="text-red-500 text-xs mb-4">
                  Please enter a valid range format (e.g., 1-5, 8, 11-13).
                </div>
              )} */}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer mt-1"
                  >
                    Upload
                  </button>

                  <p className="text-xs text-center text-gray-700 mb-1 mt-3">
                    We use bank-level security to encrypt and process your
                    statements. For more information about our privacy
                    measures,&nbsp;
                    <a
                      className="text-slate-900 underline"
                      href="mailto:founders@tryblitz.ai?subject=Security%20Inquiry"
                    >
                      email us
                    </a>
                    .
                  </p>
                </div>
              </form>
            </div>
          </>
        )}
        {currentTab === "Ancillary" && (
          <>
            <div className="flex flex-col">
              <label className="mr-2 text-sm mb-1">Carrier</label>
              <select
                className="bg-gray-100 hover:cursor-pointer hover:outline-gray-400 outline outline-1 outline-gray-400/80 rounded-sm px-2 py-1"
                name="plan"
                id="plan"
                onChange={(e) => {
                  console.log("e", e.target.value);
                  setSelectedPlan(e.target.value);
                }}
              >
                <option value="principal_ancillary">Principal</option>
                <option value="other_ancillary">Other</option>
              </select>
            </div>
            <div className="flex flex-col items-start justify-center w-full my-1 gap-1 mb-2">
              <p className="mr-2 text-sm mt-2">Page Range</p>
              <div className="flex gap-2 w-full">
                <select
                  className="bg-gray-100 px-2 rounded-sm w-full drop-shadow-sm outline outline-1 h-8 outline-gray-400/80 hover:outline-gray-400"
                  value={rangeSelection}
                  onChange={(e) => {
                    setRangeSelection(e.target.value);
                  }}
                >
                  <option value="all" className="w-full">
                    All
                  </option>
                  <option value="custom" className="w-1/2">
                    Custom
                  </option>
                </select>
                {rangeSelection === "custom" && (
                  <>
                    <input
                      type="text"
                      className="bg-gray-100 px-2 h-8 drop-shadow-sm outline outline-1 outline-gray-400/80 hover:outline-gray-400 text-sm rounded-sm w-full"
                      placeholder="e.g., 1-5, 8, 11-13"
                      onChange={(e) => {
                        if (e.target.value && e.target.value.trim()) {
                          const newValue = e.target.value.trim();
                          setCustomRange(newValue);
                          validateCustomRange(newValue);
                        }
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            {rangeSelection === "custom" && !isRangeValid && (
              <div className="text-red-500 text-xs mb-4">
                Please enter a valid range format (e.g., 1-5, 8, 11-13).
              </div>
            )}
            <div className="modal-body">
              {/* File Upload Section */}
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent the default form submission
                  setIsProcessing(true);
                  if (rangeSelection === "all") {
                    handleUpload();
                  } else {
                    const ranges = validateCustomRange(customRange);
                    if (!isProcessing && ranges.length) {
                      handleUpload(ranges as number[][]); // Proceed with uploading
                    }
                  }
                }}
              >
                <div className="flex flex-col items-center justify-center cursor-pointer">
                  <div
                    {...getRootProps()}
                    className={`p-6 mb-2 mt-2 drop-shadow-sm outline outline-1 outline-gray-400/80 hover:outline-gray-400 w-full ${
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
                    {file && (
                      <div className="text-center mb-4">
                        <p className="truncate">{file.name}</p>
                      </div>
                    )}
                  </div>
                  {/* <div className="flex items-center my-4 gap-3">
                <p>Page Range:</p>
                <select
                  className="outline outline-1 outline-gray-300 rounded-sm"
                  value={rangeSelection}
                  onChange={(e) => {
                    setRangeSelection(e.target.value);
                  }}
                >
                  <option value="all">All</option>
                  <option value="custom">Custom</option>
                </select>
                {rangeSelection === "custom" && (
                  <>
                    <input
                      type="text"
                      className="h-5 outline outline-1 outline-gray-300 text-sm rounded-sm"
                      placeholder="e.g., 1-5, 8, 11-13"
                      onChange={(e) => {
                        if (e.target.value && e.target.value.trim()) {
                          const newValue = e.target.value.trim();
                          setCustomRange(newValue);
                          validateCustomRange(newValue);
                        }
                      }}
                    />
                  </>
                )}
              </div>
              {rangeSelection === "custom" && !isRangeValid && (
                <div className="text-red-500 text-xs mb-4">
                  Please enter a valid range format (e.g., 1-5, 8, 11-13).
                </div>
              )} */}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer mt-1"
                  >
                    Upload
                  </button>

                  <p className="text-xs text-center text-gray-700 mb-1 mt-3">
                    We use bank-level security to encrypt and process your
                    statements. For more information about our privacy
                    measures,&nbsp;
                    <a
                      className="text-slate-900 underline"
                      href="mailto:founders@tryblitz.ai?subject=Security%20Inquiry"
                    >
                      email us
                    </a>
                    .
                  </p>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
