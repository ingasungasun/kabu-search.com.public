import React from "react";
import { Metadata } from "next";

import { Box } from "@mui/material";
import Heading from "@/components/heading/index.tsx";
import Screening from "@/components/app/screening/index.tsx";
import {
  SITE_NAME,
  DIVIDER,
  PROD_URL,
  TITLES,
  DESCRIPTIONS,
  SHARED_METADATA,
} from "@/lib/constants.ts";

export const metadata: Metadata = {
  title: `${TITLES.screening}${DIVIDER}${SITE_NAME}`,
  description: DESCRIPTIONS.screening,
  alternates: {
    canonical: `${PROD_URL}/screening`,
  },
  openGraph: {
    ...SHARED_METADATA.openGraph,
    title: `${TITLES.screening}${DIVIDER}${SITE_NAME}`,
    description: DESCRIPTIONS.screening,
    url: `${PROD_URL}/screening`,
  },
};

export default async function Page() {
  return (
    <>
      <Box mb={4}>
        <Heading component="h1">{TITLES.screening}</Heading>
      </Box>
      <Box>
        <Screening />
      </Box>
    </>
  );
}
