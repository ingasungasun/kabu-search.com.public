import React from "react";
import { Snackbar, Alert } from "@mui/material";
import type { SnackbarState } from "@/lib/types.ts";

const DEFAULT_AUTO_HIDE_DURATION = 5000;
const DEFAULT_VERTICAL_POSITION = "top";
const DEFAULT_HORIZONTAL_POSITION = "center";

export default function CustomSnackbar(props: {
  state: SnackbarState;
  onClose: () => void;
}) {
  const { state, onClose } = props;
  const { open, severity, anchorOrigin, autoHideDuration, message } = state;

  return (
    <Snackbar
      key="custom-snackbar"
      open={open}
      autoHideDuration={autoHideDuration ?? DEFAULT_AUTO_HIDE_DURATION}
      anchorOrigin={{
        vertical: anchorOrigin?.vertical ?? DEFAULT_VERTICAL_POSITION,
        horizontal: anchorOrigin?.horizontal ?? DEFAULT_HORIZONTAL_POSITION,
      }}
      onClose={onClose}
    >
      <Alert
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
        onClose={onClose}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
