import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box } from "@mui/material";
import Heading from "@/components/heading/index.tsx";
import Charts from "@/components/app/stocks/charts/index.tsx";
import {
  SITE_NAME,
  DESCRIPTIONS,
  SHARED_METADATA,
  NAV_TITLES,
  DIVIDER,
  PROD_URL,
} from "@/lib/constants.ts";
import { fetchStock, fetchReports } from "@/lib/functions.ts";

type Params = Promise<{
  ticker: string;
}>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const { ticker } = await props.params;
  const stock = await fetchStock(ticker);

  if (stock === null) {
    notFound();
  }

  const title = `${stock.name}(${stock.ticker})の${NAV_TITLES.charts}${DIVIDER}${SITE_NAME}`;
  const description = `${stock.name}(${stock.ticker})の${DESCRIPTIONS.stocks.charts}`;
  const canonical = `${PROD_URL}/stocks/${stock.ticker}/charts`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      ...SHARED_METADATA.openGraph,
      title,
      description,
      url: canonical,
    },
  };
}

export default async function Page(props: { params: Params }) {
  const { ticker } = await props.params;
  const stock = await fetchStock(ticker);
  const reports = await fetchReports(ticker);

  if (stock === null) {
    notFound();
  }

  if (reports === null) {
    notFound();
  }

  const h2 = `${stock.name}の${NAV_TITLES.charts}`;

  return (
    <>
      <Box mb={{ xs: 4, md: 6 }}>
        <Heading component="h2" textAlign="center">
          {h2}
        </Heading>
      </Box>
      <Box>
        <Charts reports={reports} />
      </Box>
    </>
  );
}
