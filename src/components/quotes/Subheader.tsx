import * as React from "react";
import InputSlider from "./Slider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FaMap } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";

export default function Subheader() {
  return (
    <div className="grid grid-cols-3 gap-4 flex items-center">
      {/* Left-aligned form */}
      <div className="flex gap-2">
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

      {/* Middle-aligned slider */}
      <div className="flex items-center justify-center">
        <InputSlider />
      </div>

      {/* Right-aligned buttons */}
      <div className="flex items-center justify-end font-light">
        <div className="flex items-center gap-2 cursor-pointer outline outline-1 outline-neutral-600 mr-2 rounded-sm bg-neutral-700/80 text-sm text-gray-100 px-2 py-1">
          <FaMap />
          <p>Census Data</p>
        </div>
        <div className="flex items-center gap-2 cursor-pointer outline outline-1 outline-neutral-600 mr-2 rounded-sm bg-neutral-700/80 text-sm text-gray-100 px-2 py-1">
          <FaShareAlt />
          <p>Share</p>
        </div>
        <div className="flex items-center gap-2 cursor-pointer outline outline-1 outline-neutral-600 rounded-sm bg-neutral-700/80 text-sm text-gray-100 px-2 py-1">
          <IoMdDownload />
          <p>Download CSV</p>
        </div>
      </div>
    </div>
  );
}
