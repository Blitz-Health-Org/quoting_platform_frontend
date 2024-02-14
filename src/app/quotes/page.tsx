"use client"

import React from "react";
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { IoHelpCircleSharp } from "react-icons/io5";
import Subheader from "../../components/Subheader";
import Fullheader from "../../components/Fullheader";

type Props = {};

const QuotingPage = (props: Props) => {
  const router = useRouter();
  const handleNewClientClick = () => {
    router.push("/");
  };
  return (
    <div className="w-full h-fit bg-gray-100 pb-12">

      <Fullheader/>

      <div className="h-full bg-gray-100 border border-gray-200 border-b-0 px-6 py-2">
        
        <Subheader/>

        <div className="flex gap-2 h-screen">
          
          <div className="bg-white h-full mb-4 w-1/5 mt-4 rounded-lg outline outline-1 outline-gray-300 p-6 text-center">
            Does this work?
          </div>

          <div className="bg-white h-full mb-4 w-1/5 mt-4 rounded-lg outline outline-1 outline-gray-300 p-6 text-center">
            Does this work?
          </div>

        </div>

      </div>

    </div>
    );
};

export default QuotingPage;
