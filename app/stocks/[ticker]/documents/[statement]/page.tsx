import fs from "fs";
import zlib from "zlib";
import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import { Box, Typography } from "@mui/material";
import Heading from "@/components/heading/index.tsx";
import Select from "@/components/app/stocks/documents/select/index.tsx";
import XBRL from "@/components/app/stocks/documents/xbrl/index.tsx";
import {
  SITE_NAME,
  DIVIDER,
  PROD_URL,
  DESCRIPTIONS,
  SHARED_METADATA,
  STATEMENTS,
  STORAGE_DIR,
  TEXT_BLOCKS,
} from "@/lib/constants.ts";
import { fetchStock, fetchReport, fetchReports } from "@/lib/functions.ts";

type Params = Promise<{
  ticker: string;
  statement: string;
}>;

type SearchParams = Promise<{
  period_end?: string;
}>;

const DATE_FORMAT = "YYYY-MM-DD";

export async function generateMetadata(props: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { ticker } = params;
  const statement = params.statement as keyof typeof STATEMENTS;
  const periodEnd = searchParams.period_end ?? "newest";
  const stock = await fetchStock(ticker);
  const report = await fetchReport(ticker, periodEnd);

  if (!(statement in STATEMENTS)) {
    notFound();
  }

  if (stock === null) {
    notFound();
  }

  if (report === null) {
    notFound();
  }

  const title = `${stock.name}(${stock.ticker})の${STATEMENTS[statement]}${DIVIDER}${SITE_NAME}`;
  const description = `${stock.name}(${stock.ticker})の${STATEMENTS[statement]}を表示します。${DESCRIPTIONS.stocks.documents}`;
  const canonical = `${PROD_URL}/stocks/${stock.ticker}/documents/${statement}`;

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
  const statement = params.statement as keyof typeof STATEMENTS;
  const periodEnd = searchParams.period_end ?? "newest";
  const stock = await fetchStock(ticker);
  const report = await fetchReport(ticker, periodEnd);
  const reports = await fetchReports(ticker);

  if (!(statement in STATEMENTS)) {
    notFound();
  }

  if (stock === null) {
    notFound();
  }

  if (report === null) {
    notFound();
  }

  if (reports === null) {
    notFound();
  }

  let html: string | undefined;
  const docDir = `${STORAGE_DIR}/documents/${ticker.substring(0, 2)}/${ticker}/${report.doc_id}`;
  const fileName = TEXT_BLOCKS.find(
    (temp) =>
      temp.isConsolidated === report.is_consolidated &&
      temp.statement === statement,
  )?.fileNames.find((temp) => fs.existsSync(`${docDir}/${temp}`));

  if (fileName) {
    const filePath = `${docDir}/${fileName}`;
    const buffer = fs.readFileSync(filePath);
    const decompressed = zlib.gunzipSync(buffer);
    html = decompressed.toString();
    html = html.replace(/<h\d.*?<\/h\d>/g, "");
    html = html.replace(/>[*＊※][\d０-９]+\s*(,|，|、)?</g, "><");
    html = html.replace(/>(,|，|、)</g, "><");
    html = html.replace(/table-layout\s*:\s*[\w-]+\s*;?/g, "");
    html = html.replace(
      /(margin|padding)-(left|right)\s*:\s*\d{3,}(\.\d*)?(cm|mm|Q|in|pc|pt|px)\s*;?/g,
      "",
    );
    html = html.replace(
      /(max|min)-(width)\s*:\s*\d+(\.\d*)?(cm|mm|Q|in|pc|pt|px)\s*;?/g,
      "",
    );
    html = html.replace(
      /([^-])(width)\s*:\s*\d+(\.\d*)?(cm|mm|Q|in|pc|pt|px)\s*;?/g,
      "$1", // 取り除いた文字を残す
    );
  }

  const h2 = `${stock.name}の${STATEMENTS[statement]}`;
  const h3 = dayjs(report.period_end).format("YYYY年M月期");

  const date = dayjs(report.period_end).format(DATE_FORMAT);
  const dates = reports
    .reverse()
    .map((item) => dayjs(item.period_end).format(DATE_FORMAT));

  return (
    <>
      <Box mb={3} textAlign="center">
        <Heading component="h2">{h2}</Heading>
        <Heading component="h3" variant="body1">
          （{h3}）
        </Heading>
      </Box>
      <Box mb={4}>
        <Select
          ticker={ticker}
          statement={statement}
          date={date}
          dates={dates}
        />
      </Box>
      {html ? (
        <XBRL html={html} />
      ) : (
        <Typography textAlign="center">ファイルが存在しません</Typography>
      )}
    </>
  );
}
