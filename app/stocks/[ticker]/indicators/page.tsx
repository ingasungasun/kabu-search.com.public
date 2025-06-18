import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import { Box, Typography } from "@mui/material";
import Heading from "@/components/heading/index.tsx";
import Select from "@/components/app/stocks/indicators/select/index.tsx";
import Tables from "@/components/app/stocks/indicators/tables/index.tsx";
import {
  SITE_NAME,
  DESCRIPTIONS,
  SHARED_METADATA,
  NAV_TITLES,
  DIVIDER,
  PROD_URL,
} from "@/lib/constants.ts";
import { fetchStock, fetchReport, fetchReports } from "@/lib/functions.ts";

type Params = Promise<{
  ticker: string;
}>;

type SearchParams = Promise<{
  period_end?: string;
}>;

export async function generateMetadata(props: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { ticker } = params;
  const periodEnd = searchParams.period_end ?? "newest";
  const stock = await fetchStock(ticker);
  const report = await fetchReport(ticker, periodEnd);

  if (stock === null) {
    notFound();
  }

  if (report === null) {
    notFound();
  }

  const title = `${stock.name}(${stock.ticker})の${NAV_TITLES.indicators}${DIVIDER}${SITE_NAME}`;
  const description = `${stock.name}(${stock.ticker})の${DESCRIPTIONS.stocks.indicators}`;
  const canonical = `${PROD_URL}/stocks/${stock.ticker}/indicators`;

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

export default async function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { ticker } = params;
  const periodEnd = searchParams.period_end ?? "newest";
  const stock = await fetchStock(ticker);
  const report = await fetchReport(ticker, periodEnd);
  const reports = await fetchReports(ticker);

  if (stock === null) {
    notFound();
  }

  if (report === null) {
    notFound();
  }

  if (reports === null) {
    notFound();
  }

  const h2 = `${stock.name}の${NAV_TITLES.indicators}`;
  const period = dayjs(report.period_end).format("YYYY年M月期");

  const format = "YYYY-MM-DD";
  const date = dayjs(report.period_end).format(format);
  const dates = reports
    .reverse()
    .map((item) => dayjs(item.period_end).format(format));

  return (
    <>
      <Box mb={3} textAlign="center">
        <Heading component="h2">{h2}</Heading>
        <Typography>（{period}）</Typography>
      </Box>
      <Box mb={{ xs: 4, sm: 5, md: 6 }}>
        <Select ticker={ticker} date={date} dates={dates} />
      </Box>
      <Box>
        <Tables report={report} />
      </Box>
    </>
  );
}
