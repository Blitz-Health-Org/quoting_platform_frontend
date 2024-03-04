import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { Modal } from "../ui/Modal";
import { supabase } from "@/src/supabase";
import { useDropzone } from "react-dropzone";
import { FaX } from "react-icons/fa6";
import { MdUpload } from "react-icons/md";
import Image from "next/image";
import { SnackBarContext } from "@/src/context/SnackBarContext";
import { v4 as uuid } from "uuid";
import BlumeLogo from "@/public/BlumeLogo.png";
import { ClientType } from "@/src/types/custom/Client";
import {
  clientMetadataObject,
  currentPlanMetadataObject,
  NonSystemField,
} from "@/src/types/metadata";
import { QuoteTypeWithCheckbox } from "@/src/app/select/page";
import error from "next/error";

type AddCurrentPlanModalProps = {
  setModalOpen: Dispatch<SetStateAction<any>>;
  client: ClientType;
  fetchClients: (clientId: number) => Promise<void>;
};

const AddCurrentPlanModal = ({
  setModalOpen,
  client,
  fetchClients,
}: AddCurrentPlanModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("bcbs_tx_aca");
  const [fieldsValue, setFieldsValue] = useState<Record<string, any>>({});

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  useDropzone({
    onDrop,
    multiple: true, // Allow multiple file uploads
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  const handleFieldChange = (field: string, value: any) => {
    setFieldsValue((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  async function handleSubmit(event: any) {
    event?.preventDefault();
    try {
      const { data: newQuote, error } = await supabase
        .from("quotes")
        .insert({
          client_id: client.id,
          data: {
            total_cost: fieldsValue["total_cost"],
          },
        })
        .select()
        .single();

      if (!error) {
        const { error: clientError } = await supabase
          .from("clients")
          .update({ current_plan: newQuote.id })
          .eq("id", client.id);

        if (clientError) {
          alert(`error updating current plan ${clientError}`);
          return;
        } else {
          fetchClients(client.id);
          setModalOpen("");
          return;
        }
      } else {
        alert(`error uploading data ${error}`);
        setModalOpen("");
        return;
      }
    } catch (e) {
      alert(`${e}, Failed to upload current plan`);
      setModalOpen("");
      return;
    }
  }

  return (
    <div>
      <Modal
        modalComponent={
          <>
            <div className="flex justify-between items-center mb-4 modal-header">
              <div className="flex">
                <Image
                  src={BlumeLogo}
                  alt="Description of the image"
                  width={30}
                  height={30}
                  className="mr-2 rounded-md"
                />
                <p className="text-2xl">Add Current Plan</p>
              </div>
              <button
                onClick={() => setModalOpen("")}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FaX />
              </button>
            </div>
            <form className="mt-4" onSubmit={handleSubmit}>
              {Object.values(currentPlanMetadataObject).map((clientField) => {
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
              <hr className="mb-4"></hr>
              <p className="text-xs text-right mb-4 text-gray-400">
                Your data is encrypted with bank-level TLS encryption.
              </p>
              <div className="flex w-full justify-end">
                <button
                  className="mr-2 outline outline-1 outline-gray-400 px-4 py-1 rounded-sm font-medium hover:outline-gray-500 hover:bg-gray-100"
                  type="button"
                  onClick={() => setModalOpen("")}
                >
                  Back
                </button>
                <button
                  className="outline outline-1 px-4 py-1 bg-blue-600 text-gray-100 rounded-sm font-medium hover:bg-blue-700 outline-gray-700"
                  type="submit"
                >
                  Next
                </button>
              </div>
            </form>
          </>
        }
        onClose={() => setModalOpen("")}
      />
    </div>
  );
};

export default AddCurrentPlanModal;
