import React from "react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { Box, Grid, Stack, Link, Button } from "@mui/material";
import Heading from "@/components/heading/index.tsx";
import GalleryItem from "@/components/app/charts/gallery-item/index.tsx";
import {
  SITE_NAME,
  PROD_URL,
  TITLES,
  DESCRIPTIONS,
  SHARED_METADATA,
  LOCALHOST,
  PARAM_KEYS,
  CHART_VIEWS,
} from "@/lib/constants.ts";
import type { StockWithReports } from "@/lib/types.ts";

type SearchParams = Promise<{
  b38a3841de162460f9b1bffb2842?: string;
}>;

type Section = {
  label: string;
  api: string;
  link: string;
  itemsPerPage: number;
  stocks: StockWithReports[];
};

const SECTIONS: Section[] = [
  {
    label: "増収増益の銘柄",
    api: `${LOCALHOST}/api/charts?${PARAM_KEYS.charts.increased}=true`,
    link: `/charts?${PARAM_KEYS.charts.increased}=true`,
    itemsPerPage: 6,
    stocks: [],
  },
  {
    label: "直近の決算銘柄",
    api: `${LOCALHOST}/api/charts?${PARAM_KEYS.charts.not_increased}=true`,
    link: "/charts",
    itemsPerPage: 6,
    stocks: [],
  },
];

export const metadata: Metadata = {
  title: TITLES.index,
  description: DESCRIPTIONS.index,
  alternates: {
    canonical: PROD_URL,
  },
  openGraph: {
    ...SHARED_METADATA.openGraph,
    title: TITLES.index,
    description: DESCRIPTIONS.index,
    url: PROD_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: PROD_URL,
};

async function fetchStocks(section: Section) {
  const { api, itemsPerPage } = section;
  const res = await fetch(api, {
    next: { revalidate: 3600 },
  });
  const json = await res.json();
  const stocks = json.stocks as StockWithReports[];
  return stocks.slice(0, itemsPerPage);
}

/**
 * fetch 関数が static に実行される場合、Next.js はそれをビルド時に prerendering しようとする。
 * ビルド時には当然 Next.js は起動していないので fetch 関数は失敗する。
 * 適当なパラメータを与えてそれを条件分岐に利用することで fetch 関数を動的に実行することができ、
 * ビルド時の prerendering を回避できる。
 * Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error
 */
export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const { b38a3841de162460f9b1bffb2842 } = searchParams;

  if (b38a3841de162460f9b1bffb2842 === undefined) {
    SECTIONS[0].stocks = await fetchStocks(SECTIONS[0]);
    SECTIONS[1].stocks = await fetchStocks(SECTIONS[1]);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Stack spacing={10}>
        {SECTIONS.map((section) => (
          <Box key={section.link}>
            <Box mb={4} textAlign="center">
              <Heading component="h2">{section.label}</Heading>
            </Box>
            <Grid
              mb={3}
              container
              columnSpacing={3}
              rowSpacing={{ xs: 6, sm: 8, lg: 8 }}
            >
              {section.stocks.map((stock) => (
                <Grid key={stock.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <GalleryItem
                    stock={stock}
                    chartView={CHART_VIEWS.net_sales}
                  />
                </Grid>
              ))}
            </Grid>
            <Stack alignItems="center" justifyContent="center">
              <Link href={section.link} underline="none" component={NextLink}>
                <Button
                  variant="outlined"
                  size="large"
                  disableElevation
                  sx={{ width: 300, maxWidth: "100%" }}
                >
                  もっと見る
                </Button>
              </Link>
            </Stack>
          </Box>
        ))}
      </Stack>
    </>
  );
}
