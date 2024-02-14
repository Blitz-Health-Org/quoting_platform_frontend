import * as React from 'react';
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";
import { IoHelpCircleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function Fullheader() {

  const router = useRouter();
  const handleNewClientClick = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-between h-12 bg-white outline outline-1 outline-gray-200 px-6"> 
      <div className="flex items-center cursor-pointer" onClick={handleNewClientClick}>
        <IoMdArrowBack className="mr-2" />
        <p>Client Dashboard</p>
      </div>
      <Image
        src="/Acme-corp.png" // Assuming your public folder is served from the root
        alt="Acme Corporation"
        width={66} // Set the width as per your design
        height={44} // Set the height as per your design
      />
      <div className="flex items-center">
        <div className="flex items-center gap-2 cursor-pointer outline outline-1 outline-gray-300 mr-4 rounded-sm bg-gray-100/80 text-sm text-gray-900 px-2 py-1">
          <IoHelpCircleSharp />
          <p>Help</p>
        </div>
        <div className="rounded-3xl bg-neutral-200 h-8 w-8 outline outline-1 outline-gray-400 overflow-hidden flex items-center justify-center">
          <Image
            src="/angus_logo.png" // Assuming your public folder is served from the root
            alt="Acme Corporation"
            width={30} // Set the width as per your design
            height={30} // Set the height as per your design
          />
        </div>
      </div>
    </div>
  );
}
