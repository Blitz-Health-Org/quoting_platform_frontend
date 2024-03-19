import { ClientType } from "@/src/types/custom/Client";
import { CensusDataType } from "../page";
import { Dispatch, SetStateAction, useState } from "react";
import { TierType } from "@/src/components/comparison/utils/calculateTotalCost";

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
        <div key={tier}>
          {editMode ? (
            <>
              <div>{tier}</div>
              <input
                type="number"
                value={editedCensusData[tier].num_lives ?? undefined}
                onChange={(e) =>
                  handleChange(
                    tier as keyof CensusDataType,
                    parseInt(e.target.value),
                  )
                }
              />
            </>
          ) : (
            <span>{`${tier}: ${editedCensusData[tier].num_lives}`}</span>
          )}
        </div>
      ))}
      {editMode ? (
        <>
          <button
            onClick={() => {
              onSave(editedCensusData);
              setEditMode(!editMode);
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditMode(!editMode);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <button onClick={() => setEditMode(!editMode)}>Edit</button>
      )}
    </div>
  );
};
