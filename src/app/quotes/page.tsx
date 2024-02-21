"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";
import { IoHelpCircleSharp } from "react-icons/io5";
import Subheader from "../../components/comparison/Subheader";
import Fullheader from "../../components/comparison/Fullheader";
import QuoteCard from "../../components/comparison/QuoteCard";
import Left from "../../components/comparison/Left";
import { ClientType } from "@/src/types/custom/Client";
import { supabase } from "@/src/supabase";
import { QuoteType } from "@/src/types/custom/Quote";
import { NonSystemField, quoteMetadataObject } from "@/src/types/metadata";
import { isFieldVisible } from "@/src/types/utils/isFieldVisible";
import { useSearchParams, useRouter } from "next/navigation";

type QuotingPageProps = {
  client: ClientType;
};

export default function QuotingPage() {
  const [client, setClient] = useState(null);
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const clientId = searchParams.get("clientId");
    const quoteIds = searchParams.get("quoteIds");

    if (clientId && quoteIds) {
      // Convert quoteIds back into an array of IDs
      const ids = quoteIds.split(",").map((id) => id.trim());
      fetchClientAndQuotes(clientId, ids);
    }

    setLoading(false);
  }, [searchParams]);

  const fetchClientAndQuotes = async (clientId: string, quoteIds: string[]) => {
    try {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (clientError) throw clientError;

      setClient(clientData);

      // Fetch quotes data by IDs, assuming 'id' is in quoteIds array
      const { data: quotesData, error: quotesError } = await supabase
        .from("quotes")
        .select("*")
        .in("id", quoteIds);

      if (quotesError) throw quotesError;

      const orderedByAlphaData = quotesData.sort((rowA, rowB) => {
        if (rowA.name < rowB.name) return -1;
        if (rowA.name > rowB.name) return 1;
        return 0;
      });

      setQuotes(orderedByAlphaData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally handle errors, such as setting an error state or showing a notification
    }
  };

  const visibleQuoteFields = Object.values(quoteMetadataObject).filter((val) =>
    isFieldVisible(val),
  ) as NonSystemField[];

  const nonObjectVisibleQuoteFields = visibleQuoteFields.filter(
    (val) => val.type !== "jsonb",
  );

  const objectVisibleQuoteFields = visibleQuoteFields.filter(
    (val) => val.type == "jsonb",
  );

  if (loading) {
    return <></>;
  }

  return (
    <div className="w-full h-fit bg-gray-100 pb-6">
      <Fullheader />

      <div className="h-full bg-gray-100 border border-gray-200 border-b-0 px-6 py-2">
        <Subheader />
        <div className="w-full overflow-x-auto">
          <div className="p-0.5 flex w-fit h-fit gap-2">
            <Left
              nonObjectVisibleQuoteFields={nonObjectVisibleQuoteFields}
              objectVisibleQuoteFields={objectVisibleQuoteFields}
            />
            {quotes.length > 0 ? (
              quotes.map((quote) => {
                return (
                  <QuoteCard
                    key={quote.id}
                    quote={quote}
                    nonObjectVisibleQuoteFields={nonObjectVisibleQuoteFields}
                    objectVisibleQuoteFields={objectVisibleQuoteFields}
                  />
                );
              })
            ) : (
              <div className="w-full mt-5 text-center">No Quotes Available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
