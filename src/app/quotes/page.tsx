"use client"

import React from "react";
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { IoHelpCircleSharp } from "react-icons/io5";
import Subheader from "../../components/Subheader";
import Fullheader from "../../components/Fullheader";
import Aetna from "../../components/Aetna";
import Left from "../../components/Left";

type Props = {};

const QuotingPage = (props: Props) => {
  const router = useRouter();
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
              <Aetna />
              <Aetna />
              <Aetna />
            </div>
        </div>
      </div>
    </div>
  );
};

export default QuotingPage;
