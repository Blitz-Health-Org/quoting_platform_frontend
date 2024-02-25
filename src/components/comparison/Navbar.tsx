import Image from "next/image";
import { GrDocumentPerformance } from "react-icons/gr";
import { LiaPeopleCarrySolid } from "react-icons/lia";
import { MdOutlineAttachMoney } from "react-icons/md";
import { LuMails } from "react-icons/lu";
import { FaLink } from "react-icons/fa6";
import { MdOutlineSettings } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { FiHelpCircle } from "react-icons/fi";
import { RiQuoteText } from "react-icons/ri";
import { MdOutlineBook } from "react-icons/md";
import React, { useState } from "react";
import { SnackbarAlert } from "../ui/SnackbarAlert";

const Tabs = [
  {
    name: "Carriers",
    icon: <LiaPeopleCarrySolid className="mr-2 ml-1" />,
  },
  {
    name: "Policies",
    icon: <GrDocumentPerformance className="h-4 w-4 mr-2 ml-1" />,
  },
  { name: "CRM", icon: <LuMails className="mr-2 ml-1" /> },
  { name: "Integrations", icon: <FaLink className="w-4 h-4 mr-2 ml-1" /> },
  { name: "Settings" },
];

export const Navbar = ({ selected }: { selected: string }) => {
  const isQuotesSelected = selected === "Quotes";
  const isHandbooksSelected = selected === "Handbooks";
  const isSettingsSelected = selected === "Settings";

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleBusiness = (index: any) => {
    setSnackbar({
      open: true,
      message: "This feature is coming soon!",
      severity: "info",
    });
  };

  return (
    <div className="invisible w-0 md:visible md:w-1/7 bg-gray-100/50 pb-4 pl-4 pr-4 pt-7 flex flex-col">
      <div className="mb-1 flex justify-left w-full">
        <Image src="/Blume.png" alt="Bloom Flower" width={90} height={60} />
      </div>

      <div className="flex flex-col h-full justify-between">
        <div className="w-full flex flex-col h-full">
          <div className="text-sm ml-1 mt-8 mb-1 text-gray-500 w-full p-1">
            Workspace
          </div>

          <a
            href="/"
            style={{ fontSize: "13px" }}
            className={`flex items-center font-light text-gray-700 ml-1 mb-1 w-full p-1 ${
              isQuotesSelected ? "bg-gray-200" : ""
            }`}
          >
            <RiQuoteText className="mr-2 ml-1" /> Quotes
          </a>

          <div
            onClick={handleBusiness}
            style={{ fontSize: "13px" }}
            className={`flex items-center font-light text-gray-700 ml-1 mb-1 w-full p-1 hover:cursor-pointer ${
              isHandbooksSelected ? "bg-gray-200" : ""
            }`}
          >
            <MdOutlineBook className="mr-2 ml-1" /> Handbooks
          </div>

          <div className="text-sm ml-1 mt-6 mb-1 text-gray-500 w-full p-1">
            Other
          </div>
          <div>
            <div
              onClick={handleBusiness}
              style={{ fontSize: "13px" }}
              className={`flex items-center font-light text-gray-700 ml-1 mb-1 w-full p-1 hover:cursor-pointer ${
                isSettingsSelected ? "bg-gray-200" : ""
              }`}
            >
              <FaLink className="w-4 h-4 mr-2 ml-1" /> Integrations
            </div>
          </div>
          <div
            className={`flex items-center font-light text-sm text-gray-700 ml-1 mb-1 w-full p-1 ${
              isSettingsSelected ? "bg-gray-200" : ""
            }`}
          ></div>
        </div>
        <div>
          <div>
            <a
              href="mailto:founders@blumebenefits.com?subject=Help with Blume Benefits"
              style={{ fontSize: "13px" }}
              className="flex items-center font-light text-gray-700 ml-1 mb-1 w-full p-1"
            >
              <FiHelpCircle className="mr-2 ml-1" /> Help
            </a>
          </div>
          <div
            style={{ fontSize: "13px" }}
            className="hover:cursor-pointer flex items-center font-light text-gray-700 ml-1 mb-1 w-full p-1"
          >
            <LuLogOut className="mr-2 ml-1" /> Log Out
          </div>
        </div>
      </div>

      <SnackbarAlert
        openSnackbarShare={snackbar.open}
        setOpenSnackbarShare={setSnackbar}
        snackbar={{
          open: snackbar.open,
          message: snackbar.message,
          severity: snackbar.severity,
        }}
      />
    </div>
  );
};
