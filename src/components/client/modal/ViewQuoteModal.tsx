"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "../../ui/Modal";
import { ClientType } from "@/src/types/custom/Client";
import { QuoteType } from "@/src/types/custom/Quote";
import { supabase } from "@/src/supabase";
import Image from "next/image";
import BlumeLogo from "@/public/BlumeLogo.png";
import { FaX } from "react-icons/fa6";
import { useRouter } from "next/navigation";

type Props = {
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

type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

export const ViewQuoteModal = ({ client, onClose, setOpenSnackbarShare }: Props) => {
  const [quotes, setQuotes] = useState<QuoteTypeWithCheckbox[]>([]);

  const router = useRouter();

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
          // Add isSelected property to each quote
          const quotesWithCheckbox = data.map((quote: QuoteType) => ({
            ...quote,
            isSelected: false,
          }));
          setQuotes(quotesWithCheckbox);
          console.log("Data retrieved successfully:", quotesWithCheckbox);
        }
      } catch (error) {
        console.error("Error connecting to Supabase:", error);
      }
    };
    fetchData();
  }, [client.id]);

  const handleCheckboxChange = (quoteId: string) => {
    setQuotes((prevQuotes) =>
      prevQuotes?.map((quote) =>
        quote.id === quoteId
          ? { ...quote, isSelected: !quote.isSelected }
          : quote,
      ),
    );
  };

  const handleNextClick = async () => {
    const selected = quotes?.filter((quote) => quote.isSelected) || [];
    const clientId = client.id;
    const selectedQuoteIds =
      quotes?.filter((quote) => quote.isSelected).map((quote) => quote.id) ||
      [];
    // setSelectedQuotes(selected);
      const { data: insertData, error: insertError } = await supabase
        .from('clients') // Replace with your actual Supabase table name
        .upsert({ id: client.id, selected_quotes: selected});
      
      if (insertError) {
        console.error('Error inserting row into Supabase table:', insertError);
        return { success: false };
      } else {

        setOpenSnackbarShare({
          open: true,
          message: "Comparison Created",
          severity: "success",
        }); // Use prop to set state

        onClose();

        router.push(
          `/quotes?clientId=${clientId}&quoteIds=${selectedQuoteIds.join(",")}`,
        );

        return { success: true};
      }
    }
      
  // const handleNextClick = () => {
  //   const selectedQuoteIds =
  //     quotes?.filter((quote) => quote.isSelected).map((quote) => quote.id) ||
  //     [];

  //   // Assuming client.id is the ID you want to pass
  //   const clientId = client.id;

  //   // Push the new route with query parameters for IDs
  //   router.push(
  //     `/quotes?clientId=${clientId}&quoteIds=${selectedQuoteIds.join(",")}`,
  //   );
  // };

  return (
    <div
      className={`fixed z-50 inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center`}
      style={{ backdropFilter: "blur(2px)" }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-4 rounded-md w-1/2 md:w-1/3 lg:w-1/3 h-fit">
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
          {quotes && quotes.length > 0 ? (
            <>
              <div className="overflow-y-scroll h-56">
                <h3 className="text-xl font-semibold mb-2">Choose Files</h3>
                <ul>
                {quotes.map((quote: QuoteTypeWithCheckbox) => (
                  <li key={quote.id} className="flex truncate gap-2">
                    <input
                      type="checkbox"
                      checked={quote.isSelected}
                      onChange={() => handleCheckboxChange(quote.id)}
                    />
                    <div>{quote.file_name}</div>
                  </li>
                ))}
              </ul>
            </div>
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
                onClick={handleNextClick}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <h3 className="text-large font-semibold mb-2">
            No quotes available, please upload a quote to get started.
          </h3>
        )}
      </div>
    </div>
  );
};
//
