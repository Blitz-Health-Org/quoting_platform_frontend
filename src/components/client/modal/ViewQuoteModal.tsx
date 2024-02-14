import React, { useEffect, useState } from "react";
import { Modal } from "../../ui/Modal";
import { ClientType } from "@/src/types/custom/Client";
import { QuoteType } from "@/src/types/custom/Quote";
import { supabase } from "@/src/supabase";

type Props = {
  client: ClientType;
  onClose: () => void;
};

export const ViewQuoteModal = ({ client, onClose }: Props) => {
  const [quotes, setQuotes] = useState<QuoteType | undefined>();

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
          onClose(); // Close the modal after successful submission
        }
      } catch (error) {
        console.error("Error connecting to Supabase:", error);
      }
    };
    fetchData();
  });

  return (
    <div>
      <Modal onClose={() => {}} modalComponent={<></>} />
    </div>
  );
};
