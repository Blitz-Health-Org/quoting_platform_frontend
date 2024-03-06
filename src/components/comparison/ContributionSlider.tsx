import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useState } from "react";

export const ContinuousSlider = ({ setStandardContribution }: any) => {
  const [value, setValue] = useState<number>(30);

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

  return (
    <Box sx={{ width: 200 }}>
      <Slider aria-label="Volume" value={value} onChange={handleChange} />
    </Box>
  );
};
