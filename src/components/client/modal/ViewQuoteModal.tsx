import React, { useEffect, useState } from "react";
import { Modal } from "../../ui/Modal";
import { ClientType } from "@/src/types/custom/Client";
import { QuoteType } from "@/src/types/custom/Quote";
import { supabase } from "@/src/supabase";
import Image from "next/image";
import BlumeLogo from "@/public/BlumeLogo.png";
import { FaX } from "react-icons/fa6";

type Props = {
  client: ClientType;
  onClose: () => void;
};

export const ViewQuoteModal = ({ client, onClose }: Props) => {
  const [quotes, setQuotes] = useState<QuoteType | undefined>();

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("quotes")
          .select()
          .eq("client_id", client.id);
        if (error) {
          console.error("Error retrieving data:", error);
        } else {
          setQuotes(data);
          console.log("Data retrieved successfully:", data);
        }
      } catch (error) {
        console.error("Error connecting to Supabase:", error);
      }
    };
    fetchData();
  });

  return (
    <div
      className={`fixed z-50 inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center`}
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
            <p className="text-2xl">New Comparison</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaX />
          </button>
        </div>
        <p>Sup</p>
        <hr className="mb-4 mt-4"></hr>
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
            className="outline outline-1 px-4 py-1 bg-blue-600 text-gray-100 rounded-sm font-medium hover:bg-blue-700 outline-gray-700"
            type="submit"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
//
