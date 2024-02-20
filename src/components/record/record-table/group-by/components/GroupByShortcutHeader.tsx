"use client";

import { NewRecordButton } from "@/src/components/record/record-table/view/NewRecordButton";
import { useContext, useState } from "react";
import { MdUpload } from "react-icons/md";
import { GrDocumentPerformance } from "react-icons/gr";
import { useDropzone } from "react-dropzone";
import { GroupByContext } from "@/src/context/commissions/GroupByContext";
import { supabase } from "@/src/supabase";

interface stateProps {
  files: File[];
  uploadStatus: string;
}

const Modal = ({ onClose }: { onClose: () => void }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click was outside the modal content
    if (e.target === e.currentTarget) {
      onClose(); // Close the modal
    }
  };

  const [state, setState] = useState<stateProps>({
    files: [],
    uploadStatus: "",
  });

  const onDrop = (acceptedFiles: File[]) => {
    setState({ ...state, files: acceptedFiles });
  };

  const handleUpload = async () => {
    if (state.files.length > 0) {
      const promises = state.files.map(async (file) => {
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

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center modal-overlay z-50 bg-gray-400/50"
      style={{ backdropFilter: "blur(3px)" }}
    >
      <div className="bg-white p-8 rounded-md max-w-md w-full modal-content">
        <div className="flex justify-between items-center mb-4 modal-header">
          <h2 className="text-lg font-semibold">
            Upload Commission Statements
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            X
          </button>
        </div>
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

export const RecordHeader = ({
  tableName,
}: {
  tableName: { singular: string; plural: string };
}) => {
  const [currentPage, setCurrentPage] = useState<string>("clients");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const {
    groupField: [, setGroupFieldObject],
  } = useContext(GroupByContext);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full mb-3">
        <div className="flex justify-between w-full">
          <div className="font-semibold text-md flex flex-row items-center justify-left">
            <div className="mr-1">
              <GrDocumentPerformance className="h-4 mr-1 w-4 text-gray-600" />{" "}
            </div>
            <div>Policies</div>
          </div>

          <div className="flex">
            <div
              className="flex items-center col-span-1 px-2 py-1 text-sm rounded-sm outline outline-1 outline-gray-300 shadow-sm bg-transparent cursor-pointer text-center w-fit hover:bg-gray-200/50"
              onClick={openModal}
            >
              <MdUpload className="mr-1" /> Statement
            </div>
            <div
              className="col-span-1 px-2 py-1 text-sm rounded-sm outline outline-1 outline-gray-300 shadow-sm bg-transparent cursor-pointer text-center w-fit ml-2 hover:bg-gray-200/50"
              // onClick={handleNewButtonClick}
            >
              <NewRecordButton tableName={tableName} />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <Modal onClose={closeModal} />}
    </>
  );
};
