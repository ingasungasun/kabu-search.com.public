import React from "react";
import { Metadata } from "next";
import { Box } from "@mui/material";
import { Report } from "@prisma/client";
import Heading from "@/components/heading/index.tsx";
import Table from "@/components/app/ranking/table/index.tsx";
import {
  SITE_NAME,
  DIVIDER,
  PROD_URL,
  TITLES,
  DESCRIPTIONS,
  SHARED_METADATA,
  LOCALHOST,
  PARAM_KEYS,
  DIVISIONS,
  INDUSTRIES,
  SORTS_IN_RANKING,
} from "@/lib/constants.ts";
import type { ReportWithStock } from "@/lib/types.ts";

type SearchParams = Promise<{
  market?: string;
  industry?: string;
  sort?: keyof Report;
}>;

export const metadata: Metadata = {
  title: `${TITLES.ranking}${DIVIDER}${SITE_NAME}`,
  description: DESCRIPTIONS.ranking,
  alternates: {
    canonical: `${PROD_URL}/ranking`,
  },
  openGraph: {
    ...SHARED_METADATA.openGraph,
    title: `${TITLES.ranking}${DIVIDER}${SITE_NAME}`,
    description: DESCRIPTIONS.ranking,
    url: `${PROD_URL}/ranking`,
  },
};

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const { market, industry, sort } = searchParams;

  let url = `${LOCALHOST}/api/ranking`;
  const temp = new URLSearchParams();

  if (typeof market === "string" && DIVISIONS.includes(market)) {
    temp.set(PARAM_KEYS.ranking.market, market);
  }

  if (typeof industry === "string" && INDUSTRIES.includes(industry)) {
    temp.set(PARAM_KEYS.ranking.industry, industry);
  }

  if (typeof sort === "string" && SORTS_IN_RANKING.slice(1).includes(sort)) {
    temp.set(PARAM_KEYS.ranking.sort, sort);
  }

  if (temp.size > 0) {
    url += `?${temp.toString()}`;
  }

  const res = await fetch(url);
  const json = await res.json();
  const reports = json.reports as ReportWithStock[];

  let h1 = TITLES.ranking;

  if (typeof industry === "string" && INDUSTRIES.includes(industry)) {
    h1 = `${industry}の${h1}`;
  }

  return (
    <>
      <Box mb={4}>
        <Heading component="h1">{h1}</Heading>
      </Box>
      <Box>
        <Table
          market={market}
          industry={industry}
          sort={sort}
          reports={reports}
        />
      </Box>
    </>
  );
}
