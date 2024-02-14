import React from "react";
import { Snackbar, Alert } from "@mui/material";

type SnackBarAlertProps = {
  openSnackbarShare: boolean;
  setOpenSnackbarShare: (val: boolean) => void;
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
      onClose={() => setOpenSnackbarShare(false)}
    >
      <Alert
        onClose={() => setOpenSnackbarShare(false)}
        severity={(snackbar.severity as any) ?? "success"} //fuck this inane typing
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};
