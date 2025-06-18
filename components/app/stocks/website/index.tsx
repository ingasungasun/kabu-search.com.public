import React from "react";
import NextLink from "next/link";
import { Stock } from "@prisma/client";
import { Stack, Typography, Link } from "@mui/material";
import { OpenInNewOutlined } from "@mui/icons-material";

export default function Website(props: { stock: Stock }) {
  const { stock } = props;

  return (
    <Stack spacing={0.5} direction="row">
      <Link
        href={stock.website}
        underline="none"
        component={NextLink}
        target="_blank"
      >
        <OpenInNewOutlined fontSize="small" />
      </Link>
      <Link
        href={stock.website}
        underline="none"
        component={NextLink}
        target="_blank"
      >
        <Typography variant="body2">公式サイト</Typography>
      </Link>
    </Stack>
  );
}
