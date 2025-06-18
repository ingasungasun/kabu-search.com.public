"use client";

import React from "react";
import { Stack, Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

export default function Section(props: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <Stack spacing={1}>
      <Box>
        <Typography variant="large" fontWeight="bold">
          {props.name}
        </Typography>
      </Box>
      <Stack border={1} borderColor={grey[300]} borderRadius={1}>
        {props.children}
      </Stack>
    </Stack>
  );
}
