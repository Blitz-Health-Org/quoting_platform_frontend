import { ClientType } from "@/src/types/custom/Client";
import { CensusDataType } from "../page";
import { Dispatch, SetStateAction, useState } from "react";
import { TierType } from "@/src/components/comparison/utils/calculateTotalCost";
import { MdEdit, MdCancel } from "react-icons/md";
import { FaSave } from "react-icons/fa";

type CensusDataSectionProps = {
  censusData: CensusDataType;
  setCensusData: Dispatch<SetStateAction<CensusDataType>>;
  onSave: (editedCensusData: CensusDataType) => void;
};

export const CensusDataSection = ({
  censusData,
  onSave,
}: CensusDataSectionProps) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedCensusData, setEditedCensusData] =
    useState<CensusDataType>(censusData);

  const handleChange = (tier: keyof CensusDataType, numLives: number) => {
    setEditedCensusData((prevData) => ({
      ...prevData,
      [tier]: { ...prevData[tier], num_lives: numLives },
    }));
  };

  return (
    <div>
      {(["employee", "spouse", "family", "child"] as TierType[]).map((tier) => (
        <div className="bg-gray-100/20 outline outline-1 outline-gray-300 px-2 py-1 my-2 rounded-sm" key={tier}>
          {editMode ? (
            <div className="flex gap-2 items-center">
              <div>{tier}</div>
              <input
                type="number"
                className="px-2 w-12 outline outline-1 outline-gray-200"
                value={editedCensusData[tier].num_lives ?? undefined}
                onChange={(e) =>
                  handleChange(
                    tier as keyof CensusDataType,
                    parseInt(e.target.value),
                  )
                }
              />
            </div>
          ) : (
            <span>{`${tier}: ${editedCensusData[tier].num_lives ?? "N/A"}`}</span>
          )}
        </div>
      ))}
      {editMode ? (
        <div className="w-full flex gap-2 justify-center">
          <button
            onClick={() => {
              onSave(editedCensusData);
              setEditMode(!editMode);
            }}
            className="flex w-full gap-2 justify-center items-center px-2 py-1 outline outline-1 outline-gray-200 bg-gray-100/20 hover:bg-gray-100/50 rounded-sm"
          >
            <FaSave />
            <p>Save</p>
          </button>
          {/* <button
            onClick={() => {
              setEditMode(!editMode);
            }}
            className="flex w-1/2 gap-2 justify-center items-center px-2 py-1 outline outline-1 outline-gray-200 rounded-sm"
          >
            <MdCancel />
            <p>Cancel</p>
          </button> */}
        </div>
      ) : (
        <button onClick={() => setEditMode(!editMode)} className="flex w-full outline outline-1 bg-gray-100/20 hover:bg-gray-100/50 outline-gray-200 justify-center rounded-sm px-2 py-1 gap-2 items-center">
          <MdEdit/>
          <p>Edit</p>
        </button>
      )}
    </div>
  );
};
