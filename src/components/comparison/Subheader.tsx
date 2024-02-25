"use client";

import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FaMap } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import { SnackbarAlert } from "../ui/SnackbarAlert";

type SubheaderProps = {
  isPaneOpen: boolean;
  onPaneToggle: (newState: boolean) => void;
  copyUrlToClipboard: any;
  handleDownloadCSV: any;
  quotesLength: any;
};

export const Subheader: React.FC<SubheaderProps> = ({
  isPaneOpen,
  onPaneToggle,
  copyUrlToClipboard,
  handleDownloadCSV,
  quotesLength,
}) => {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
      {/* Left-aligned form */}
      <div className="flex gap-2 justify-center lg:justify-start items-center">
        <button onClick={handleBusiness} className="flex items-center mr-1">
          <p className="mr-1">Rank by</p>
          <IoChevronDown />
        </button>
        <button onClick={handleBusiness} className="flex items-center mr-1">
          <p className="mr-1">Filter</p>
          <IoChevronDown />
        </button>
        <button onClick={handleBusiness} className="flex items-center mr-1">
          <p className="mr-1">Age banded rates</p>
          <IoChevronDown />
        </button>
        {/* <FormControl
          variant="standard"
          sx={{ m: 1, minWidth: 120 }}
          size="small"
        >
          <InputLabel id="demo-simple-select-standard-label">
            Rank By
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label="Age"
            value=""
          >
            <MenuItem value="">
              <em>Blume Total Rating</em>
            </MenuItem>
            <MenuItem value={10}>Total Price</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          variant="standard"
          sx={{ m: 1, minWidth: 120 }}
          size="small"
        >
          <InputLabel id="demo-simple-select-standard-label">Plans</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label="Age"
            value=""
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl> */}
      </div>

      <div className="col-span-1 text-center flex items-center justify-center gap-1">
        <p>Showing {quotesLength} Quotes </p>
        <p className="cursor-pointer" onClick={handleBusiness}>
          | Edit |{" "}
        </p>
        <p className="cursor-pointer" onClick={handleBusiness}>
          Add Current Plan
        </p>
      </div>

      {/* Right-aligned buttons */}
      <div className="flex items-center lg:justify-end font-light justify-center">
        <button
          onClick={copyUrlToClipboard}
          className="flex items-center gap-2 cursor-pointer outline outline-1 outline-neutral-600 mr-2 rounded-sm bg-neutral-700/80 text-sm text-gray-100 px-2 py-1"
        >
          <FaShareAlt />
          <p>Share</p>
        </button>
        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 cursor-pointer outline outline-1 outline-neutral-600 mr-2 rounded-sm bg-neutral-700/80 text-sm text-gray-100 px-2 py-1"
        >
          <IoMdDownload />
          <p>Download CSV</p>
        </button>
        <button
          onClick={() => onPaneToggle(!isPaneOpen)}
          className="flex items-center gap-2 cursor-pointer outline outline-1 outline-neutral-600 rounded-sm bg-neutral-700/80 text-sm text-gray-100 px-2 py-1"
        >
          <IoIosSettings />
          <p>Settings</p>
        </button>
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
