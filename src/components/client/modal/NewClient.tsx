//TODO: Type checking

import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import BlumeLogo from "@/public/BlumeLogo.png";
import {
  clientMetadataObject,
  FieldType,
  NonSystemField,
} from "@/src/types/metadata";
import { ClientType } from "@/src/types/custom/Client";
import { FaX } from "react-icons/fa6";
import { UserContext } from "@/src/context/UserContext";
import { supabase } from "@/src/supabase";
import { SnackBarContext } from "@/src/context/SnackBarContext";
import { useGetUserData } from "@/src/utils/useGetUserData";

export type StateProps = {
  files: File[];
  uploadStatus: string;
  setClients: Dispatch<SetStateAction<ClientType>>;
};

export const NewClientModal = ({ onClose, setClients }: any) => {
  const [fieldsValue, setFieldsValue] = useState<Record<string, any>>({});
  const {
    userId: [userId, , loading],
  } = useContext(UserContext);
  const { userData, loadingUserData } = useGetUserData();

  const { setSnackbar } = useContext(SnackBarContext);

  const handleFieldChange = (field: string, value: any) => {
    setFieldsValue((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  // const onDrop = (acceptedFiles: File[]) => {
  //   if (acceptedFiles.length !== 1) {
  //     //error
  //   }
  //   handleFieldChange("icon", acceptedFiles[0]);
  // };

  // const handleUpload = async (files: File[]) => {
  //   if (files.length > 0) {
  //     const promises = files.map(async (file: any) => {
  //       const randomDigit = Math.floor(Math.random() * 1024); // Generate random 8-bit digit
  //       const newFileName = `${file.name}_${randomDigit}`; // Append random digit to the file name

  //       const { data, error } = await supabase.storage
  //         .from("images")
  //         .upload(`path/${newFileName}`, file);

  //       if (error) {
  //         console.error(`Error uploading file ${newFileName}:`, error);
  //         return { success: false, fileName: newFileName };
  //       } else {
  //         return { success: true, fileName: newFileName };
  //       }
  //     });

  //     const results = await Promise.all(promises);
  //     const successUploads = results.filter((result) => result.success);

  //     if (successUploads.length === files.length) {
  //       // Additional actions after successful upload
  //     } else {
  //       //Implement
  //     }
  //   }
  // };

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   multiple: false, // Allow only one file
  // });

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (Object.values(fieldsValue).every((fieldValue) => !fieldValue)) {
      return;
    }

    fieldsValue["user_id"] = userId;
    const { data: newClient, error } = await supabase
      .from("clients")
      .upsert(fieldsValue)
      .select()
      .single();

    if (error || !newClient) {
      alert("Error passing to supabase");
      return;
    } else {
      console.log("data", newClient);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/create_new_client`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client: {
              zip_code: fieldsValue["zip_code"],
              id: newClient.id,
              name: newClient.name,
            },
            userId: userId,
          }),
        },
      );

      if (!response.ok) {
        onClose();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchData();

      onClose(newClient.id);

      setSnackbar({
        open: true,
        message: "New Client Created!",
        severity: "success",
      }); // Use prop to set state
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center`}
      style={{ backdropFilter: "blur(2px)" }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-4 rounded-md w-1/2 md:w-1/3 lg:1/3">
        <div className="flex justify-between items-center mb-4 modal-header">
          <div className="flex">
            <Image
              src={BlumeLogo}
              alt="Description of the image"
              width={30}
              height={30}
              className="mr-2 rounded-md"
            />
            <p className="text-2xl">New Client</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaX />
          </button>
        </div>

        <form className="mt-4" onSubmit={handleSubmit}>
          {Object.values(clientMetadataObject)
            .filter(
              (clientField) =>
                !clientField.isDefault &&
                !clientField.isSystem &&
                !(clientField.field === "icon") &&
                !(clientField.field === "plan_category"),
            )
            .map((clientField) => {
              return (
                <>
                  <div className="flex items-end">
                    <p className="text-sm mr-1">
                      {(clientField as NonSystemField).label}
                    </p>
                    {clientField.isNullable && (
                      <p className="text-xs text-gray-500">(Optional)</p>
                    )}
                  </div>
                  <input
                    required={!clientField.isNullable}
                    placeholder={clientField?.placeholder ?? undefined}
                    className="w-full border border-1 border-gray-200 rounded-md p-2 text-sm mt-1 mb-3"
                    value={fieldsValue[clientField.field]}
                    onChange={(e) => {
                      handleFieldChange(clientField.field, e.target.value);
                    }}
                  />
                </>
              );
            })}

          {/* <div className="modal-body">
            <div className="flex items-end">
              <p className="text-sm mr-1">Logo</p>
              <p className="text-xs text-gray-500">(Optional)</p>
            </div>
           
            <div className="mb-6 flex gap-2 items-center justify-start">
              <div
                {...getRootProps()}
                className={`mb-2 mt-2 drop-shadow-sm outline outline-1 outline-gray-400/65 hover:outline-black w-fit px-2 ${
                  isDragActive ? "bg-gray-200" : "bg-gray-100"
                }`}
                style={{ borderRadius: "0.25rem" }}
              >
                <input {...getInputProps()} />
                {state.files.length > 0 && (
                  <div className="text-center mb-4">
                    {state.files.map((file, index) => (
                      <p className="truncate" key={index}>
                        {file.name}
                      </p>
                    ))}
                  </div>
                )}
                <div className="text-center text-sm mb-2 text-slate-600 mt-2">
                  Upload
                </div>
              </div>
            </div>
          </div> */}

          <hr className="mb-4"></hr>
          <p className="text-xs text-right mb-4 text-gray-400">
            Your data is encrypted with bank-level TLS encryption.
          </p>
          <div className="flex w-full justify-end">
            <button
              className="mr-2 outline outline-1 outline-gray-400 px-4 py-1 rounded-sm font-medium hover:outline-gray-500 hover:bg-gray-100"
              type="button"
              onClick={onClose}
            >
              Back
            </button>
            <button
              className="outline outline-1 outline-gray-200 px-4 py-1 bg-blue-600 text-gray-100 rounded-sm font-medium hover:bg-blue-700 outline-gray-700"
              type="submit"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
