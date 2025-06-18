import React from "react";
import { Metadata } from "next";
import { Box } from "@mui/material";
import Contact from "@/components/app/contact/index.tsx";
import Heading from "@/components/heading/index.tsx";
import {
  SITE_NAME,
  DIVIDER,
  PROD_URL,
  TITLES,
  SHARED_METADATA,
} from "@/lib/constants.ts";

export const metadata: Metadata = {
  title: `${TITLES.contact}${DIVIDER}${SITE_NAME}`,
  alternates: {
    canonical: `${PROD_URL}/contact`,
  },
  openGraph: {
    ...SHARED_METADATA.openGraph,
    title: `${TITLES.contact}${DIVIDER}${SITE_NAME}`,
    url: `${PROD_URL}/contact`,
  },
};

export default async function Page() {
  return (
    <>
      <Box mb={4}>
        <Heading component="h1">{TITLES.contact}</Heading>
      </Box>
      <Box>
        <Contact />
      </Box>
    </>
  );
}
