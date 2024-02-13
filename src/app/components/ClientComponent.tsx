import { Client } from "@/src/types/Client";
import { FaBook, FaPlus } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import Image from "next/image";

export type ClientComponentProps = {
  client: Client;
};

export const ClientComponent = ({ client }: ClientComponentProps) => {
  return (
    <>
      <div className="w-full flex flex-col h-fit bg-white shadow-sm outline outline-1 outline-gray-200 rounded-md p-3">
        <div className="flex items-center">
          <Image
            src={client.icon}
            alt="Description of the image"
            width={30}
            height={30}
            className="mr-2 rounded-md"
          />
          <p>Apple</p>
        </div>
        <div className="text-gray-500 text-sm font-light mb-1">
          <p className="mt-3"> Plans - 9 </p>
          <p className="mt-0.5"> Quotes - 72 </p>
          <p className="mt-0.5"> Lives - 28,592 </p>
        </div>
        <div className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-3 text-sm">
          <FaBook className="mr-1" />
          <p>Create Handbook</p>
        </div>
        <div className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-1 text-sm">
          <IoEyeSharp className="mr-1" />
          <p>View Quotes</p>
        </div>
        <div className="outline outline-1 hover:bg-gray-100/50 cursor-pointer font-light flex items-center justify-center outline-gray-200 p-0.5 rounded-sm mb-1 mt-1 text-sm">
          <FaPlus className="mr-1" />
          <p>New Quote</p>
        </div>
      </div>
    </>
  );
};
