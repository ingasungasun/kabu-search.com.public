import React from "react";
import type { Metadata } from "next";
import { Box, Stack, Typography } from "@mui/material";
import { TITLES } from "@/lib/constants.ts";

export const metadata: Metadata = {
  title: TITLES.notFound,
};

export default function NotFound() {
  return (
    <>
      <Stack
        alignItems="center"
        spacing={0.5}
        width={300}
        maxWidth="90vw"
        position="absolute"
        top="50%"
        left="50%"
        sx={{
          transform: "translate(-50%, -50%)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography component="p" variant="h6" fontWeight="bold">
            404
          </Typography>
          <Typography>|</Typography>
          <Typography component="p" variant="h6" fontWeight="bold">
            Not Found
          </Typography>
        </Stack>
        <Box>
          <Typography component="p" variant="h6">
            {TITLES.notFound}
          </Typography>
        </Box>
      </Stack>
    </>
  );
}
