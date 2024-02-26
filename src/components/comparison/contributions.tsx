"use client";

import React, { useEffect, useState } from "react";
import "../../components/comparison/sum.css"; // import your custom styles
import "react-sliding-pane/dist/react-sliding-pane.css";
import Input from "@mui/material/Input";
import { MdEdit } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { parseInt } from "lodash";
import { supabase } from "@/src/supabase";

export function Contributions({
  standardContributions,
  setStandardContributions,
  setShowStandardContributions,
}: any) {
  const [editedContributions, setEditedContributions] = useState(
    standardContributions,
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEdit = () => {
    // Enable editing mode
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Disable editing mode
    setStandardContributions(editedContributions);
    setIsEditing(false);
    setShowStandardContributions(false);

    // You can save the JSON data to your desired location or state.
    // For example, you can send it to the server or store it in another state.
  };

  return (
    <div className="w-full outline outline-1 outline-gray-300 p-1 bg-slate-100/80 rounded-sm flex-col items-center justify-center shadow">
      <div className="mb-1.5 flex items-center justify-left pl-2 pt-2">
        <p className="text-sm mr-2 font-bold">Employee</p>
        <p className="mr-2">|</p>
        <Input
          className="w-11"
          defaultValue={100}
          size="small"
          value={editedContributions.employee.percent}
          onChange={(e) => {
            let newValue = parseInt(e.target.value);
            // Check if the value exceeds 100 and reset it to 100
            newValue = newValue > 100 ? 100 : newValue;

            setEditedContributions((prev: any) => {
              return {
                ...prev,
                employee: { ...prev.employee, percent: newValue },
              };
            });
          }}
          disabled={!isEditing}
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
          disabled={!isEditing}
          className="w-12"
          defaultValue={50}
          size="small"
          value={editedContributions.employee.employees}
          onChange={(e) =>
            setStandardContributions((prev: any) => ({
              ...prev,
              employee: {
                ...prev.employee,
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
      <div className="mb-1.5 flex items-center justify-left pl-2 pt-1">
        <p className="text-sm mr-2 font-bold">Spouse</p>
        <p className="mr-2">|</p>
        <Input
          className="w-11"
          defaultValue={100}
          size="small"
          value={editedContributions.spouse.percent}
          onChange={(e) => {
            let newValue = parseInt(e.target.value);
            // Check if the value exceeds 100 and reset it to 100
            newValue = newValue > 100 ? 100 : newValue;

            setEditedContributions((prev: any) => ({
              ...prev,
              spouse: { ...prev.spouse, percent: newValue },
            }));
          }}
          disabled={!isEditing}
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
          disabled={!isEditing}
          className="w-12"
          defaultValue={50}
          size="small"
          value={editedContributions.spouse.employees}
          onChange={(e) =>
            setStandardContributions((prev: any) => ({
              ...prev,
              spouse: {
                ...prev.spouse,
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
          value={editedContributions.child.percent}
          onChange={(e) => {
            let newValue = parseInt(e.target.value);
            // Check if the value exceeds 100 and reset it to 100
            newValue = newValue > 100 ? 100 : newValue;

            setEditedContributions((prev: any) => ({
              ...prev,
              child: { ...prev.child, percent: newValue },
            }));
          }}
          disabled={!isEditing}
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
          disabled={!isEditing}
          className="w-12"
          defaultValue={50}
          size="small"
          value={editedContributions.child.employees}
          onChange={(e) =>
            setStandardContributions((prev: any) => ({
              ...prev,
              child: { ...prev.child, employees: parseInt(e.target.value) },
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
          value={editedContributions.family.percent}
          onChange={(e) => {
            let newValue = parseInt(e.target.value);
            // Check if the value exceeds 100 and reset it to 100
            newValue = newValue > 100 ? 100 : newValue;

            setEditedContributions((prev: any) => ({
              ...prev,
              family: { ...prev.family, percent: newValue },
            }));
          }}
          disabled={!isEditing}
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
          disabled={!isEditing}
          className="w-12"
          defaultValue={50}
          size="small"
          value={editedContributions.family.employees}
          onChange={(e) =>
            setEditedContributions((prev: any) => ({
              ...prev,
              family: {
                ...prev.family,
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
        {!isEditing && (
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
        {isEditing && (
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
