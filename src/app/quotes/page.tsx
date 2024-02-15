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
  client = {
    created_at: "323",
    icon: "",
    num_lives: 3,
    user_id: 1,
    name: "",
    id: 1,
  };
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
  }, []);

  console.log("quotes", quotes);

  const handleNewClientClick = () => {
    router.push("/");
  };

  return (
    <div className="w-full h-fit bg-gray-100 pb-6">
      <Fullheader />

      <div className="h-full bg-gray-100 border border-gray-200 border-b-0 px-6 py-2">
        <Subheader />

        <div className="w-full overflow-x-auto">
          <div className="p-0.5 flex h-fit gap-2">
            <Left />
            {quotes.length > 0 ? (
              quotes.map((quote) => {
                return <QuoteCard key={quote.id} quote={quote} />;
              })
            ) : (
              <div className="w-full mt-5 text-center">No Quotes Available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotingPage;
