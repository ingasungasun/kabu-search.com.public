"use client";

import React from "react";
import NextLink from "next/link";
import { Stack, Box, Typography, Link } from "@mui/material";
import { grey } from "@mui/material/colors";
import ChartJS from "@/components/chart-js/index.tsx";
import type { StockWithReports, ChartView } from "@/lib/types.ts";

export default function GalleryItem(props: {
  stock: StockWithReports;
  chartView: ChartView;
}) {
  const { stock, chartView } = props;
  const spacing = 1;
  const items: string[] = [];

  // ticker
  items.push(stock.ticker);

  // market
  if (stock.market === "東証") {
    items.push(stock.market + stock.division);
  } else {
    items.push(stock.market);
  }

  // industry
  if (stock.industry !== "") {
    items.push(stock.industry);
  }

  return (
    <>
      <Box mb={1} textAlign="center">
        <Typography component="h2" variant="large">
          <Link
            component={NextLink}
            href={`/stocks/${stock.ticker}/charts`}
            fontWeight="bold"
            color={grey[900]}
          >
            {stock.name}
          </Link>
        </Typography>
      </Box>
      <Stack mb={1} direction="row" justifyContent="center" spacing={spacing}>
        {items.map((item, index) => (
          <Typography
            key={index}
            variant="body2"
            color={grey[600]}
            sx={
              index > 0
                ? { "&::before": { paddingRight: spacing, content: "'/'" } }
                : {}
            }
          >
            {item}
          </Typography>
        ))}
      </Stack>
      <ChartJS chartView={chartView} reports={stock.Reports} />
    </>
  );
}
