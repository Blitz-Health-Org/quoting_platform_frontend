import * as React from "react";
import Image from "next/image";
import Apple from "../../public/Screenshot.png";

export default function Left() {
  const itemList = [
    "Effective Date",
    "Metal Tier",
    "Plan Name",
    "Provider Net.",
    "Network Status",
    "Deductibles",
  ];

  const itemList2 = [
    "Overall (Ind./Fam.)",
    "Medical (Ind./Fam.)",
    "Prescription Drug",
    "Out-of-Pocket (Ind./Fam.)",
  ];

  const itemList3 = [
    "Primary Care Visit",
    "Specialist Visit",
    "Preventative Care",
  ];

  const itemList4 = ["Laboratory Test", "X-Rays / Diagnostics", "Imaging"];

  const itemList5 = ["Tier 1", "Tier 2", "Tier 3", "Tier 4"];

  const itemList6 = ["Facility Fee"];

  const itemList7 = [
    "Emergency Room Services",
    "Emergency Medical Trans.",
    "Urgent Care",
  ];

  const itemList8 = ["Facility Fee", "Physician/Surgeon Fee"];

  const itemList9 = [
    "Outpatient Mental Health",
    "Inpatient Mental Health",
    "SUD - Outpatient",
    "SUD - Inpatient",
  ];

  const itemList10 = ["Rehabilitation", "Durable Medical Equipment"];

  const itemList11 = ["EE Only", "EE + Spouse", "EE + Child", "EE + Family"];

  return (
    <div className="bg-white h-fit w-1/6 mt-4 rounded-lg outline outline-1 outline-gray-300 py-6 text-center">
      <div className="flex mb-16"></div>
      <div className="w-full text-sm">
        {itemList.map((item: any, index: any) => (
          <div key={index}>
            <hr className="w-full border-t-1 border-gray-300"></hr>
            <div className="flex items-center h-full bg-violet-100/60 w-full">
              <p className="ml-4 break-all font-semibold">{item}</p>
            </div>
          </div>
        ))}
        {itemList2.map((item: any, index: any) => (
          <div key={index}>
            <hr className="w-full border-t-1 border-gray-300"></hr>
            <div className="flex items-center bg-white w-full h-full">
              <p className="ml-4 break-all">{item}</p>
            </div>
          </div>
        ))}
        <hr className="w-full border-t-1 border-gray-500"></hr>
        <div className="flex items-center h-full bg-violet-100/60 w-full">
          <p className="ml-4 break-all font-semibold">Visit to Provider</p>
        </div>
        {itemList3.map((item: any, index: any) => (
          <div key={index}>
            <hr className="w-full border-t-1 border-gray-300"></hr>
            <div className="flex items-center h-full bg-white w-full">
              <p className="ml-4 break-all">{item}</p>
            </div>
          </div>
        ))}
        <hr className="w-full border-t-1 border-gray-500"></hr>
        <div className="flex items-center h-full bg-violet-100/60 w-full">
          <p className="ml-4 break-all font-semibold">Test</p>
        </div>
        {itemList4.map((item: any, index: any) => (
          <div key={index}>
            <hr className="w-full border-t-1 border-gray-300"></hr>
            <div className="flex items-center h-full bg-white w-full">
              <p className="ml-4 break-all">{item}</p>
            </div>
          </div>
        ))}
        <hr className="w-full border-t-1 border-gray-500"></hr>
        <div className="flex items-center h-full bg-violet-100/60 w-full">
          <p className="ml-4 break-all font-semibold">Drugs</p>
        </div>
        {itemList5.map((item: any, index: any) => (
          <div key={index}>
            <hr className="w-full border-t-1 border-gray-300"></hr>
            <div className="flex items-center h-full bg-white w-full">
              <p className="ml-4 break-all">{item}</p>
            </div>
          </div>
        ))}
        <hr className="w-full border-t-1 border-gray-500"></hr>
        <div className="flex items-center h-full bg-violet-100/60 w-full">
          <p className="ml-4 break-all font-semibold">Outpatient Surgery</p>
        </div>
        {itemList6.map((item: any, index: any) => (
          <div key={index}>
            <hr className="w-full border-t-1 border-gray-500"></hr>
            <div className="flex items-center h-full bg-white w-full">
              <p className="ml-4 break-all">{item}</p>
            </div>
          </div>
        ))}
        <hr className="w-full border-t-1 border-gray-500"></hr>
        <div className="flex items-center h-full bg-violet-100/60 w-full">
          <p className="ml-4 break-all font-semibold">
            Need Immediate Attention
          </p>
        </div>
        {itemList7.map((item: any, index: any) => (
          <div key={index}>
            <hr className="w-full border-t-1 border-gray-300"></hr>
            <div className="flex items-center h-full bg-white w-full">
              <p className="ml-4 break-all">{item}</p>
            </div>
          </div>
        ))}
        <hr className="w-full border-t-1 border-gray-500"></hr>
        <div className="flex items-center h-full bg-violet-100/60 w-full">
          <p className="ml-4 break-all font-semibold">Hospital Stay</p>
        </div>
        {itemList8.map((item: any, index: any) => (
          <div key={index}>
            <hr className="w-full border-t-1 border-gray-300"></hr>
            <div className="flex items-center h-full bg-white w-full">
              <p className="ml-4 break-all">{item}</p>
            </div>
          </div>
        ))}
        <hr className="w-full border-t-1 border-gray-500"></hr>
        <div className="flex items-center h-full bg-violet-100/60 w-full">
          <p className="ml-4 break-all font-semibold">Mental/Behavioral/SUD</p>
        </div>
        {itemList9.map((item: any, index: any) => (
          <div key={index}>
            <hr className="w-full border-t-1 border-gray-300"></hr>
            <div className="flex items-center h-full bg-white w-full">
              <p className="ml-4 break-all">{item}</p>
            </div>
          </div>
        ))}
        <hr className="w-full border-t-1 border-gray-500"></hr>
        <div className="flex items-center h-full bg-violet-100/60 w-full">
          <p className="ml-4 break-all font-semibold">
            Other Special Health Needs
          </p>
        </div>
        {itemList10.map((item: any, index: any) => (
          <div key={index}>
            <hr className="w-full border-t-1 border-gray-300"></hr>
            <div className="flex items-center h-full bg-white w-full">
              <p className="ml-4 break-all">{item}</p>
            </div>
          </div>
        ))}
        <hr className="w-full border-t-1 border-gray-500"></hr>
        <div className="flex items-center h-full bg-violet-100/60 w-full">
          <p className="ml-4 font-semibold break-all">Premiums/Enrollment</p>
        </div>
        {itemList11.map((item: any, index: any) => (
          <div key={index}>
            <div className="flex items-center h-full bg-white w-full">
              <p className="ml-4 break-all">{item}</p>
            </div>
            <hr className="w-full border-t-1 border-gray-300"></hr>
          </div>
        ))}
        <hr className="w-full border-t-1 border-gray-500"></hr>
        <div className="flex items-center h-full bg-violet-100/60 w-full">
          <p className="ml-4 break-all font-semibold">Total Cost</p>
        </div>
      </div>
    </div>
  );
}
