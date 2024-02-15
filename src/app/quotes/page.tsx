"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { IoHelpCircleSharp } from "react-icons/io5";
import Subheader from "../../components/quotes/Subheader";
import Fullheader from "../../components/quotes/Fullheader";
import QuoteCard from "../../components/quotes/QuoteCard";
import Left from "../../components/quotes/Left";
import { ClientType } from "@/src/types/custom/Client";
import { supabase } from "@/src/supabase";
import { QuoteType } from "@/src/types/custom/Quote";

type QuotingPageProps = {
  client: ClientType;
};

const QuotingPage = ({ client }: QuotingPageProps) => {
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuoteType[]>([]);

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

  const handleNewClientClick = () => {
    router.push("/");
  };

  return (
    <div className="w-full h-fit bg-gray-100 pb-6">
      <Fullheader />

      <div className="h-full bg-gray-100 border border-gray-200 border-b-0 px-6 py-2">
        <Subheader />

        <div className="w-fit overflow-x-auto">
          <div className="w-fit p-0.5 flex h-fit gap-2">
            <Left />
            {quotes.map((quote) => {
              return <QuoteCard key={quote.id} quote={quote} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotingPage;
