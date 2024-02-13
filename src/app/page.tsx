import "./globals.css";
import { Header } from "../components/Header";
import { PiListBulletsBold } from "react-icons/pi";
import { RiArrowDropDownLine } from "react-icons/ri";
import Apple from "../../public/Apple.jpg";
import Image from "next/image";
import { FaBook } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-row bg-white">
      <Header selected="Policies" />

      <div className="w-full md:w-6/7">
        <main className="h-screen flex-col w-full bg-gray-100 bg-opacity-50 pl-2 pr-6 pt-6 pb-6 overflow-hidden text-gray-700">
          <div className="flex w-full items-center justify-start mb-4 mt-1">
            <PiListBulletsBold className="mr-2" />
            <p className="mr-1">Quoting</p>
            <p className="mr-1 text-gray-400 text-xs">•</p>
            <p className="mr-1 text-gray-400">(5)</p>
            <RiArrowDropDownLine className="text-gray-400" />
          </div>
          <div className="rounded-md w-full h-full flex-col overflow-scroll">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 h-fit overflow-scroll p-0.5">
              <div className="w-full flex flex-col h-fit bg-white shadow-sm outline outline-1 outline-gray-200 rounded-md p-3">
                <div className="flex items-center">
                  <Image
                    src={Apple}
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
