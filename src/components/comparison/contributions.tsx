"use client";

import React, { useEffect, useState } from "react";
import "../../components/comparison/sum.css"; // import your custom styles
import "react-sliding-pane/dist/react-sliding-pane.css";
import Input from "@mui/material/Input";
import { MdEdit } from "react-icons/md";
import { FaSave } from "react-icons/fa";

export function Contributions() {
  const [editStandardContributions, setEditStandardContributions] =
    useState(false);

  const [standardContributions, setStandardContributions] = useState({
    ee: { percent: 100, employees: 50 },
    eeSpouse: { percent: 100, employees: 50 },
    eeChild: { percent: 100, employees: 50 },
    eeFamily: { percent: 100, employees: 50 },
  });

  const handleEdit = () => {
    // Enable editing mode
    setEditStandardContributions(true);
  };

  const handleSave = () => {
    // Disable editing mode
    setEditStandardContributions(false);

    // Save the edited values to JSON
    const jsonResult = JSON.stringify(standardContributions);

    // You can save the JSON data to your desired location or state.
    // For example, you can send it to the server or store it in another state.
  };

  return (
    <div className="w-full outline outline-1 outline-gray-300 p-1 bg-slate-100/80 rounded-sm flex-col items-center justify-center shadow">
      <div className="mb-1.5 flex items-center justify-left pl-2 pt-2">
        <p className="text-sm mr-2 font-bold">EE</p>
        <p className="mr-2">|</p>
        <Input
          className="w-11"
          defaultValue={100}
          size="small"
          value={standardContributions.ee.percent}
          onChange={(e) => {
            let newValue = parseInt(e.target.value);
            // Check if the value exceeds 100 and reset it to 100
            newValue = newValue > 100 ? 100 : newValue;

            setStandardContributions((prev) => ({
              ...prev,
              ee: { ...prev.ee, percent: newValue },
            }));
          }}
          disabled={!editStandardContributions}
          inputProps={{
            step: 1,
            min: 0,
            max: 100,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
        <p className="text-sm text-gray-500 mr-2">%</p>
        <p className="mr-2">|</p>
        <Input
          disabled={!editStandardContributions}
          className="w-12"
          defaultValue={50}
          size="small"
          value={standardContributions.ee.employees}
          onChange={(e) =>
            setStandardContributions((prev) => ({
              ...prev,
              ee: { ...prev.ee, employees: parseInt(e.target.value) },
            }))
          }
          inputProps={{
            step: 1,
            min: 0,
            max: 10000,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
        <p className="text-sm text-gray-800">Lives</p>
      </div>
      <div className="mb-1.5 flex items-center justify-left pl-2 pt-1">
        <p className="text-sm mr-2 font-bold">Spouse</p>
        <p className="mr-2">|</p>
        <Input
          className="w-11"
          defaultValue={100}
          size="small"
          value={standardContributions.eeSpouse.percent}
          onChange={(e) => {
            let newValue = parseInt(e.target.value);
            // Check if the value exceeds 100 and reset it to 100
            newValue = newValue > 100 ? 100 : newValue;

            setStandardContributions((prev) => ({
              ...prev,
              eeSpouse: { ...prev.eeSpouse, percent: newValue },
            }));
          }}
          disabled={!editStandardContributions}
          inputProps={{
            step: 1,
            min: 0,
            max: 100,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
        <p className="text-sm text-gray-500 mr-2">%</p>
        <p className="mr-2">|</p>
        <Input
          disabled={!editStandardContributions}
          className="w-12"
          defaultValue={50}
          size="small"
          value={standardContributions.eeSpouse.employees}
          onChange={(e) =>
            setStandardContributions((prev) => ({
              ...prev,
              eeSpouse: {
                ...prev.eeSpouse,
                employees: parseInt(e.target.value),
              },
            }))
          }
          inputProps={{
            step: 1,
            min: 0,
            max: 10000,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
        <p className="text-sm text-gray-800 pl-2 pt-1">Lives</p>
      </div>
      <div className="mb-1.5 flex items-center justify-left pl-2 pt-1">
        <p className="text-sm mr-2 font-bold">Child</p>
        <p className="mr-2">|</p>
        <Input
          className="w-11"
          defaultValue={100}
          size="small"
          value={standardContributions.eeChild.percent}
          onChange={(e) => {
            let newValue = parseInt(e.target.value);
            // Check if the value exceeds 100 and reset it to 100
            newValue = newValue > 100 ? 100 : newValue;

            setStandardContributions((prev) => ({
              ...prev,
              eeChild: { ...prev.eeChild, percent: newValue },
            }));
          }}
          disabled={!editStandardContributions}
          inputProps={{
            step: 1,
            min: 0,
            max: 100,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
        <p className="text-sm text-gray-500 mr-2">%</p>
        <p className="mr-2">|</p>
        <Input
          disabled={!editStandardContributions}
          className="w-12"
          defaultValue={50}
          size="small"
          value={standardContributions.eeChild.employees}
          onChange={(e) =>
            setStandardContributions((prev) => ({
              ...prev,
              eeChild: { ...prev.eeChild, employees: parseInt(e.target.value) },
            }))
          }
          inputProps={{
            step: 1,
            min: 0,
            max: 10000,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
        <p className="text-sm text-gray-800">Lives</p>
      </div>
      <div className="mb-1.5 flex items-center justify-left pl-2 pt-1">
        <p className="text-sm mr-2 font-bold">Family</p>
        <p className="mr-2">|</p>
        <Input
          className="w-11"
          defaultValue={100}
          size="small"
          value={standardContributions.eeFamily.percent}
          onChange={(e) => {
            let newValue = parseInt(e.target.value);
            // Check if the value exceeds 100 and reset it to 100
            newValue = newValue > 100 ? 100 : newValue;

            setStandardContributions((prev) => ({
              ...prev,
              eeFamily: { ...prev.eeFamily, percent: newValue },
            }));
          }}
          disabled={!editStandardContributions}
          inputProps={{
            step: 1,
            min: 0,
            max: 100,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
        <p className="text-sm text-gray-500 mr-2">%</p>
        <p className="mr-2">|</p>
        <Input
          disabled={!editStandardContributions}
          className="w-12"
          defaultValue={50}
          size="small"
          value={standardContributions.eeFamily.employees}
          onChange={(e) =>
            setStandardContributions((prev) => ({
              ...prev,
              eeFamily: {
                ...prev.eeFamily,
                employees: parseInt(e.target.value),
              },
            }))
          }
          inputProps={{
            step: 1,
            min: 0,
            max: 10000,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
        <p className="text-sm text-gray-800">Lives</p>
      </div>

      <div className="mb-3 mt-3 flex items-center justify-center pl-2 w-full">
        {!editStandardContributions && (
          <button
            onClick={handleEdit}
            className="mr-2 outline outline-1 outline-gray-300 hover:outline-gray-400/80 shadow-sm px-2 py-0.5 rounded-sm mt-1 hover:bg-slate-200/50 hover:shadow w-full"
          >
            <div className="flex items-center gap-2 justify-center">
              <MdEdit />
              <p>Edit</p>
            </div>
          </button>
        )}
        {editStandardContributions && (
          <button
            onClick={handleSave}
            className="mr-2 outline outline-1 outline-gray-300 hover:outline-gray-400/80 shadow-sm px-2 py-0.5 rounded-sm mt-1 hover:bg-slate-200/50 bg-gray-100 w-full"
          >
            <div className="flex items-center gap-2 justify-center">
              <FaSave />
              <p>Save</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}