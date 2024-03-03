import React, { Dispatch, SetStateAction } from "react";
import { Snackbar, Alert } from "@mui/material";

type SnackBarAlertProps = {
  openSnackbarShare: boolean;
  setOpenSnackbarShare: Dispatch<
    SetStateAction<{
      open: boolean;
      message: string;
      severity: string;
    }>
  >;
  snackbar: {
    open: boolean;
    message: string;
    severity: string;
  };
};

export const SnackbarAlert = ({
  openSnackbarShare,
  setOpenSnackbarShare,
  snackbar,
}: SnackBarAlertProps) => {
  return (
    <Snackbar
      key={`4`}
      open={openSnackbarShare}
      autoHideDuration={4000}
      onClose={() =>
        setOpenSnackbarShare((prev) => {
          return {
            ...prev,
            open: false,
          };
        })
      }
    >
      <Alert
        onClose={() =>
          setOpenSnackbarShare({ open: false, message: "", severity: "info" })
        }
        severity={(snackbar.severity as any) ?? "success"} //fuck this inane typing
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};
