//TODO: Type checking

import Image from "next/image";
import { useState } from "react";
import BlumeLogo from "@/public/BlumeLogo.png";
import { supabase } from "@/src/supabase";
import {
  FieldType,
  NonSystemField,
  quoteMetadataObject,
} from "@/src/types/metadata";
import { ClientType } from "@/src/types/custom/Client";
import { QuoteType } from "@/src/types/custom/Quote";

type AddNewQuoteModalProps = {
  client: ClientType;
  onClose: () => void;
  setOpenSnackbarShare: ({
    open,
    message,
    severity,
  }: {
    open: boolean;
    message: string;
    severity: string;
  }) => void;
};
export const AddNewQuoteModal = ({
  client,
  onClose,
  setOpenSnackbarShare,
}: AddNewQuoteModalProps) => {
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [fieldsValue, setFieldsValue] = useState<Record<string, any>>({});

  const handleFieldChange = (field: string, value: any) => {
    setFieldsValue((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (Object.values(fieldsValue).every((fieldValue) => !fieldValue)) {
      return;
    }
    // SEND DATA
    try {
      const { data, error } = await supabase
        .from("quotes") // Replace with your actual table name
        .insert(fieldsValue);

      if (error) {
        console.error("Error inserting data:", error);
      } else {
        //UPDATE DATA
        try {
          const { data, error } = await supabase.from("quotes").select();
          if (error) {
            console.error("Error retrieving data:", error);
          } else {
            console.log("Data retrieved successfully:", data);
            setQuotes(data);
            onClose(); // Close the modal after successful submission
          }
        } catch (error) {
          console.error("Error connecting to Supabase:", error);
        }
        console.log("Data inserted successfully:", data);
      }
    } catch (error) {
      console.error("Error connecting to Supabase:", error);
    }

    setOpenSnackbarShare({
      open: true,
      message: `New Quote Added to ${client.name}!`,
      severity: "success",
    }); // Use prop to set state
  };

  return (
    <div
      className={`fixed inset-0 z-10 bg-gray-800 bg-opacity-50 flex items-center justify-center`}
      style={{ backdropFilter: "blur(2px)" }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-4 rounded-md w-1/2 md:w-1/3 lg:1/3">
        <div className="flex">
          <Image
            src={BlumeLogo}
            alt="Description of the image"
            width={30}
            height={30}
            className="mr-2 rounded-md"
          />
          <p className="text-2xl">Add a Quote</p>
        </div>

        <form className="mt-4" onSubmit={handleSubmit}>
          {Object.values(quoteMetadataObject)
            .filter((field) => !field.isDefault && !field.isSystem)
            .map((field: FieldType) => {
              return (
                <>
                  <div className="flex items-end">
                    <p className="text-sm mr-1">
                      {(field as NonSystemField).label}
                    </p>
                    {field.isNullable && (
                      <p className="text-xs text-gray-500">(Optional)</p>
                    )}
                  </div>
                  <input
                    required={!field.isNullable}
                    placeholder={field?.placeholder ?? undefined}
                    className="w-full border border-1 border-gray-200 rounded-md p-2 text-sm mt-1 mb-3"
                    value={fieldsValue[field.field]}
                    onChange={(e) => {
                      handleFieldChange(field.field, e.target.value);
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

          <div className="flex w-full justify-end">
            <button
              className="mr-2 outline outline-1 outline-gray-200 px-4 py-2 rounded-md"
              type="button"
              onClick={onClose}
            >
              Close Modal
            </button>
            <button
              className="outline outline-1 outline-gray-200 px-4 py-2 bg-slate-800 text-gray-100 rounded-md"
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
