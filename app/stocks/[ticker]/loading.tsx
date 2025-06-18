import React from "react";
import { Stack, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Stack alignItems="center">
      <CircularProgress />
    </Stack>
  );
}
