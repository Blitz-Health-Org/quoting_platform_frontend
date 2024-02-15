import * as React from "react";
import Image from "next/image";
import Apple from "@/public/Screenshot.png";
import { QuoteType } from "@/src/types/custom/Quote";

export default function QuoteCard(quote: QuoteType) {
  return (
    <div className="bg-white h-full mb-4 w-1/4 mt-4 rounded-lg outline outline-1 outline-gray-300 py-6 text-center overscroll-none">
      <div className="flex w-full justify-center h-16">
        <div className="w-fit">
          <Image
            src={Apple} //TODO: provide defaultImage, make this default in the suapbase not case catching on the fe
            alt="Description of the image"
            width={50}
            height={40}
            className="mr-2 rounded-md"
          />
        </div>
        <div className="flex flex-col w-fit justify-center items-start ml-1 mb-4">
          <h1 className="font-bold text-xl">{quote?.name}</h1>
          <p className="text-sm">{quote?.website}</p>
        </div>
      </div>

      <div className="flex flex-col items-center bg-violet-100/60">
        <textarea
          defaultValue={
            quote.plan_details?.date
              ? `CURRENT - ${quote.plan_details?.date}`
              : "N/A"
          }
          className="text-center resize-none text-sm content-center h-7 w-full bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto rounded-md p-1"
        />
        <hr className="w-full border-t-1 border-gray-300"></hr>
        <textarea
          defaultValue={"Gold"}
          className="text-center resize-none text-sm content-center h-7 w-full bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto rounded-md p-1"
        />
        <hr className="w-full border-t-1 border-gray-300"></hr>
        <textarea
          defaultValue={"Gold 500/30"}
          className="text-center resize-none text-sm content-center h-7 w-full bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto rounded-md p-1"
        />
        <hr className="w-full border-t-1 border-gray-300"></hr>
        <textarea
          defaultValue={"Full PPO"}
          className="text-center resize-none text-sm content-center h-7 w-full bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto rounded-md p-1"
        />
        <hr className="w-full border-t-1 border-gray-300"></hr>
        <div className="flex w-full">
          <textarea
            defaultValue={"PPO"}
            className="text-center font-semibold resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"Out-of-Network"}
            className="text-center font-semibold resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-500"></hr>

        <div className="flex w-full">
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent border-r focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"N/A"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"N/A"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$500/$1,000"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"$1,000/$2,000"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$100/$200"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"N/A"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$8,150/$16,300"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"$16,300/$32,600"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-500"></hr>

        <div className="flex w-full">
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$30 Copay"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$55 Copay"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"No Charge"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"Not Covered"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-500"></hr>

        <div className="flex w-full">
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$30 Copay/20%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40% up to $350/Day"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$50 Copay/$100 Copay"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40% up to $350/Day"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"20%/$100 Copay + 20%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40% up to $350/Day"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-500"></hr>

        <div className="flex w-full">
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$15 Copay"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"Not Covered"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$50 Copay"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"Not Covered"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$80 Copay"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"Not Covered"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"30% up to $250"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"Not Covered"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-500"></hr>

        <div className="flex w-full">
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"20%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40% up to $350/Day"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-500"></hr>

        <div className="flex w-full">
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$250 + 20% ER + 20% DR"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"$250 + 20% ER + 20% DR"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"20%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"20%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$30 Copay"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-500"></hr>

        <div className="flex w-full">
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"20%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40% up to $2,000/Day"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"20%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-500"></hr>

        <div className="flex w-full">
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$30 Copay"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"20%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40% up to $2,000/Day"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$30 Copay"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"20%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40% up to $2,000/Day"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-500"></hr>

        <div className="flex w-full">
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"20%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"40% up to $350/Day"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"50%"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
          <textarea
            defaultValue={"Not Covered"}
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-500"></hr>

        <div className="flex w-full">
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
          <textarea
            disabled
            className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$80 / 26 employees"}
            className="text-center resize-none text-sm content-center h-7 w-full bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$150 / 12 employees"}
            className="text-center resize-none text-sm content-center h-7 w-full bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$100 / 14 employees"}
            className="text-center resize-none text-sm content-center h-7 w-full bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>

        <div className="flex w-full bg-white">
          <textarea
            defaultValue={"$250 / 14 employees"}
            className="text-center resize-none text-sm content-center h-7 w-full bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-500"></hr>

        <div className="flex w-full">
          <textarea
            defaultValue={"$8,780"}
            className="font-semibold text-center resize-none text-sm content-center h-7 w-full border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
          />
        </div>
        <hr className="w-full border-t-1 border-gray-300"></hr>
      </div>
    </div>
  );
}
