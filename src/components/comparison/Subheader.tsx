import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FaMap } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";

type SubheaderProps = {
  isPaneOpen: boolean;
  onPaneToggle: (newState: boolean) => void;
  copyUrlToClipboard: any;
  handleDownloadCSV: any
};

export const Subheader: React.FC<SubheaderProps> = ({ isPaneOpen, onPaneToggle, copyUrlToClipboard, handleDownloadCSV }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left-aligned form */}
      <div className="flex gap-2 justify-center lg:justify-start items-center">
        <FormControl
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
        </FormControl>
      </div>

      {/* Right-aligned buttons */}
      <div className="flex items-center lg:justify-end font-light justify-center">
        <button onClick={copyUrlToClipboard} className="flex items-center gap-2 cursor-pointer outline outline-1 outline-neutral-600 mr-2 rounded-sm bg-neutral-700/80 text-sm text-gray-100 px-2 py-1">
          <FaShareAlt />
          <p>Share</p>
        </button>
        <button 
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 cursor-pointer outline outline-1 outline-neutral-600 mr-2 rounded-sm bg-neutral-700/80 text-sm text-gray-100 px-2 py-1">
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
    </div>
  );
}
