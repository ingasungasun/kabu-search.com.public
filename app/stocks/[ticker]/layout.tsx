import React from "react";
import { notFound } from "next/navigation";
import { Box, Typography } from "@mui/material";
import Heading from "@/components/heading/index.tsx";
import Details from "@/components/app/stocks/details/index.tsx";
import Website from "@/components/app/stocks/website/index.tsx";
import Nav from "@/components/app/stocks/nav/index.tsx";
import { fetchStock, fetchReports } from "@/lib/functions.ts";

type Params = Promise<{
  ticker: string;
}>;

export default async function Layout(props: {
  params: Params;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const { ticker } = params;
  const { children } = props;
  const stock = await fetchStock(ticker);
  const reports = await fetchReports(ticker);

  if (stock === null) {
    notFound();
  }

  if (reports === null) {
    notFound();
  }

  const h1 = stock.name;

  return (
    <>
      <Box mb={1}>
        <Heading component="h1">{h1}</Heading>
      </Box>
      <Box mb={{ xs: 2, md: 3 }}>
        <Box>
          <Details stock={stock} />
        </Box>
        {stock.website && (
          <Box mt={1}>
            <Website stock={stock} />
          </Box>
        )}
      </Box>
      <Box mb={{ xs: 4, md: 6 }}>
        <Nav stock={stock} />
      </Box>
      {reports.length > 0 ? (
        children
      ) : (
        <Typography mt={10} component="p" variant="h6" textAlign="center">
          有価証券報告書が存在しません
        </Typography>
      )}
    </>
  );
}
