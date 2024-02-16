import React from "react";
import { Snackbar, Alert } from "@mui/material";

type SnackBarAlertProps = {
  openSnackbarShare: boolean;
  setOpenSnackbarShare: ({
    open,
    message,
    severity,
  }: {
    open: boolean;
    message: string;
    severity: any;
  }) => void;
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
        setOpenSnackbarShare({ open: false, message: "", severity: "info" })
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
