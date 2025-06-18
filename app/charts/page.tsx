import React from "react";
import { Metadata } from "next";
import { Report } from "@prisma/client";
import { Box } from "@mui/material";
import Gallery from "@/components/app/charts/gallery/index.tsx";
import Heading from "@/components/heading/index.tsx";
import {
  SITE_NAME,
  DIVIDER,
  PROD_URL,
  TITLES,
  DESCRIPTIONS,
  SHARED_METADATA,
  LOCALHOST,
  PARAM_KEYS,
  ITEMS_PER_PAGE,
  INDUSTRIES,
} from "@/lib/constants.ts";
import { formatPositiveNumber } from "@/lib/functions.ts";
import type { StockWithReports } from "@/lib/types.ts";

type SearchParams = Promise<{
  market?: string;
  industry?: string;
  sort?: keyof Report;
  increased?: string;
  page?: string;
}>;

export const metadata: Metadata = {
  title: `${TITLES.charts}${DIVIDER}${SITE_NAME}`,
  description: DESCRIPTIONS.charts,
  alternates: {
    canonical: `${PROD_URL}/charts`,
  },
  openGraph: {
    ...SHARED_METADATA.openGraph,
    title: `${TITLES.charts}${DIVIDER}${SITE_NAME}`,
    description: DESCRIPTIONS.charts,
    url: `${PROD_URL}/charts`,
  },
};

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const { market, industry, sort } = searchParams;
  const increased = searchParams.increased === "true";
  const page = formatPositiveNumber(searchParams.page);

  const temp = new URLSearchParams();

  if (typeof market === "string") {
    temp.set(PARAM_KEYS.charts.market, market);
  }

  if (typeof industry === "string") {
    temp.set(PARAM_KEYS.charts.industry, industry);
  }

  if (typeof sort === "string") {
    temp.set(PARAM_KEYS.charts.sort, sort);
  }

  if (increased) {
    temp.set(PARAM_KEYS.charts.increased, "true");
  }

  temp.set(PARAM_KEYS.charts.page, String(page));

  const url = `${LOCALHOST}/api/charts?${temp.toString()}`;
  const res = await fetch(url);
  const json = await res.json();
  const stocks = json.stocks as StockWithReports[];
  const totalItems = json.totalItems as number;
  const maxPage = Math.ceil(totalItems / ITEMS_PER_PAGE.charts);

  let h1 = TITLES.charts;

  if (typeof industry === "string" && INDUSTRIES.includes(industry)) {
    h1 = `${industry}の${h1}`;
  }

  return (
    <>
      <Box mb={4}>
        <Heading component="h1">{h1}</Heading>
      </Box>
      <Box>
        <Gallery
          market={market}
          industry={industry}
          sort={sort}
          increased={increased}
          page={page}
          maxPage={maxPage}
          stocks={stocks}
        />
      </Box>
    </>
  );
}
