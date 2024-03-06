"use client";

import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { SnackbarAlert } from "../components/ui/SnackbarAlert";

type SnackBarContextProps = {
  setSnackbar: Dispatch<SetStateAction<any>>;
};

// Create a context
export const SnackBarContext = createContext<SnackBarContextProps>({
  setSnackbar: () => {},
});

export const SnackBarContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // default severity
  });

  return (
    <>
      <SnackBarContext.Provider value={{ setSnackbar }}>
        {children}
        <SnackbarAlert
          openSnackbarShare={snackbar.open}
          setOpenSnackbarShare={setSnackbar}
          snackbar={snackbar}
        />
      </SnackBarContext.Provider>
    </>
  );
};
