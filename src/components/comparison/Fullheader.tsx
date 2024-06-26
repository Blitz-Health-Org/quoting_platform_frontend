import * as React from "react";
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";
import { IoHelpCircleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { IconBuilding } from "@tabler/icons-react";
import BlumeLogo from "@/public/NewBlumeLogo.jpg";

export default function Fullheader({ clientName }: { clientName: string }) {
  const router = useRouter();
  const handleNewClientClick = () => {
    // router.push("/");
    window.location.href = "/";
  };

  const handleDivClick = () => {
    window.location.href = "mailto:founders@blumebenefits.com";
  };

  return (
    <div className="z-50 absolute w-full grid grid-cols-3 items-center justify-between h-12 bg-white outline outline-1 outline-gray-200 pr-6 pl-2">
      <div
        className="flex items-center cursor-pointer ml-2"
        onClick={handleNewClientClick}
      >
        <Image
          src={BlumeLogo}
          width={100}
          height={100}
          alt={"Blume Logo"}
          className="mr-4"
        />
        <p className="truncate">Client Dashboard</p>
      </div>

      <div className="flex items-center justify-center">
        <IconBuilding className="mr-2" />
        <p>{clientName}</p>
      </div>

      <div className="flex items-center justify-end">
        <div
          className="flex items-center gap-2 cursor-pointer outline outline-1 outline-gray-300 mr-4 rounded-sm bg-gray-100/80 text-sm text-gray-900 px-2 py-1"
          onClick={handleDivClick}
        >
          <IoHelpCircleSharp />
          <p>Help</p>
        </div>
        <div className="rounded-3xl bg-neutral-200 h-8 w-8 outline outline-1 outline-gray-400 overflow-hidden flex items-center justify-center">
          <Image
            src="/angus_logo.png" // Assuming your public folder is served from the root
            alt="Acme Corporation"
            width={30}
            height={30}
          />
        </div>
      </div>
    </div>
  );
}
