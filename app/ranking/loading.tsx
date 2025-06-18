import React from "react";
import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "calc(100vh / 2)",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
