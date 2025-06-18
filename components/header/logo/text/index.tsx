import React from "react";
import { Typography } from "@mui/material";
import { SITE_NAME } from "@/lib/constants.ts";

export default function Text() {
  return (
    <Typography
      component="span"
      variant="h6"
      color="text.primary"
      noWrap
      sx={{
        fontFamily: "'M PLUS 1 Variable', sans-serif",
        fontWeight: "800",
      }}
    >
      {SITE_NAME}
    </Typography>
  );
}
