import React from "react";
import NextLink from "next/link";
import dayjs from "dayjs";
import { Stock, Report } from "@prisma/client";
import { Stack, Box, Typography, Link } from "@mui/material";
import { grey } from "@mui/material/colors";
import Heading from "@/components/heading/index.tsx";
import {
  STATEMENTS,
  INDICATORS,
  NOT_APPLICABLE_SYMBOL,
} from "@/lib/constants.ts";
import {
  indicatorToFractionDigits,
  adjustValue,
  formatNumber,
} from "@/lib/functions.ts";
import type { IndicatorKey } from "@/lib/types.ts";
import styles from "./styles.module.scss";

function VerticalSeparator() {
  return (
    <Box
      width="3px"
      height="100%"
      position="absolute"
      top="0"
      right="0"
      sx={{
        background:
          "linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, rgba(0, 0, 0, 0))",
      }}
    ></Box>
  );
}

export default function Table(props: {
  stock: Stock;
  statement: keyof typeof STATEMENTS;
  keys: (keyof Report)[];
  reports: Report[];
}) {
  const { stock, statement, keys, reports } = props;

  function createURL(index: number) {
    let url = `/stocks/${stock.ticker}/documents/${statement}`;

    if (index < reports.length - 1) {
      const periodEnd = dayjs(reports[index].period_end).format("YYYY-MM-DD");
      url += `?period_end=${periodEnd}`;
    }

    return url;
  }

  return (
    <Stack alignItems="center" spacing={{ xs: 1, md: 2 }}>
      <Box>
        <Heading component="h3" textAlign="center" fontWeight="bold">
          {STATEMENTS[statement]}
        </Heading>
        <Typography variant="body2" textAlign="center">
          （単位：百万円）
        </Typography>
      </Box>
      <Box
        maxWidth="100%"
        border={1}
        borderRadius={2}
        borderColor={grey[300]}
        sx={{ overflowX: "scroll" }}
      >
        <Box component="table" className={styles.table} minWidth={300}>
          <thead>
            <tr>
              <th>
                <VerticalSeparator />
              </th>
              {reports.map((report, index) => (
                <th key={report.id}>
                  <Link
                    component={NextLink}
                    href={createURL(index)}
                    underline="none"
                  >
                    <Typography variant="body2" noWrap>
                      {dayjs(report.period_end).format("YYYY/MM")}
                    </Typography>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr key={key}>
                <td>
                  <VerticalSeparator />
                  <Heading
                    component="h4"
                    variant="body2"
                    textAlign="right"
                    noWrap
                  >
                    {INDICATORS[key as IndicatorKey]}
                  </Heading>
                </td>
                {reports.map((report) => (
                  <td key={report.id}>
                    <Typography variant="body2" textAlign="right" noWrap>
                      {report[key] !== null
                        ? formatNumber(
                            adjustValue(report, key as IndicatorKey) as number,
                            indicatorToFractionDigits(key as IndicatorKey),
                          )
                        : NOT_APPLICABLE_SYMBOL}
                    </Typography>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </Stack>
  );
}
