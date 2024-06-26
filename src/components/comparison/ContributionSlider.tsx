import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx"; // Import clsx
import { twMerge } from "tailwind-merge"; // Import tailwindMerge

type ContinuousSliderProps = {
  setStandardContribution: Dispatch<SetStateAction<any>>;
  className?: string;
  hideLabels?: boolean;
};

export const ContinuousSlider = ({
  setStandardContribution,
  className,
  hideLabels,
}: ContinuousSliderProps) => {
  const [value, setValue] = useState<number>(50);

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setValue(newValue); // Update local state to reflect the slider's new value
    }

    setStandardContribution((prevState: any) => ({
      ...prevState,
      data: {
        employee: { ...prevState.data.employee, percent: newValue },
        family: { ...prevState.data.family, percent: newValue },
        child: { ...prevState.data.child, percent: newValue },
        spouse: { ...prevState.data.spouse, percent: newValue },
      },
    }));
  };

  const marks = [
    {
      value: 0,
      label: "0%",
    },
    {
      value: 100,
      label: "100%",
    },
  ];

  return (
    <Box
      sx={{ width: 200 }}
      className={clsx(twMerge("text-center", className))} // Use clsx and tailwindMerge here
    >
      <Slider
        aria-label="Volume"
        marks={hideLabels ? undefined : marks}
        valueLabelDisplay="auto"
        value={value}
        step={1}
        onChange={handleChange}
      />
      {!hideLabels && (
        <div className="text-sm text-center">Contribution Amount</div>
      )}
    </Box>
  );
};
