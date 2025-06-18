"use client";

import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { Stock } from "@prisma/client";
import { Box, Stack, Typography, Link } from "@mui/material";
import { grey } from "@mui/material/colors";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import Pagination from "@/components/pagination/index.tsx";
import { INDICATORS, NOT_APPLICABLE_SYMBOL } from "@/lib/constants.ts";
import {
  indicatorToUnit,
  indicatorToFractionDigits,
  adjustValue,
  formatNumber,
} from "@/lib/functions.ts";
import type { ReportWithStock, IndicatorKey } from "@/lib/types.ts";
import styles from "./styles.module.scss";

const ROWS_PER_PAGE = 50;
const SORT_ICON_SPACING = 0.3;
const ROW_SPACING = 0.3;
const NAME_WIDTH = { xs: 120, sm: 250, md: 300 };
const INDICATOR_MIN_WIDTH = 50;
const TABLE_ID = "screening-result-table";

export default function ResultTable(props: {
  keys: IndicatorKey[];
  reports: ReportWithStock[];
}) {
  const [keys, setKeys] = useState<IndicatorKey[]>(props.keys);
  const [reports, setReports] = useState<ReportWithStock[]>(props.reports);
  const [sortKey, setSortKey] = useState<IndicatorKey | "ticker">(
    props.keys[0],
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  function SortIcon() {
    return sortOrder === "asc" ? <KeyboardArrowUp /> : <KeyboardArrowDown />;
  }

  function scrollTableToTop() {
    const table = document.querySelector(`#${TABLE_ID}`);

    if (table) {
      table.scrollIntoView({
        behavior: "instant",
      });
    }
  }

  function formatMarket(stock: Stock) {
    let text = stock.market;

    if (stock.market === "東証") {
      text += stock.division;
    }

    return text;
  }

  function handleClickLabel(key: typeof sortKey) {
    let order: typeof sortOrder;

    if (key === sortKey) {
      order = sortOrder === "asc" ? "desc" : "asc";
    } else {
      order = key === "ticker" ? "asc" : "desc";
    }

    setReports(
      [...reports].sort((hoge, fuga) => {
        const hogeValue = hoge[key] as number | null;
        const fugaValue = fuga[key] as number | null;

        if (hogeValue === null) {
          return 1;
        }

        if (fugaValue === null) {
          return -1;
        }

        if (hogeValue > fugaValue) {
          return order === "asc" ? 1 : -1;
        }

        if (fugaValue > hogeValue) {
          return order === "asc" ? -1 : 1;
        }

        return 0;
      }),
    );
    setPage(1);
    setSortKey(key);
    setSortOrder(order);
    scrollTableToTop();
  }

  function handleChangePagination(value: number) {
    setPage(value);
    scrollTableToTop();
  }

  useEffect(() => {
    setKeys(props.keys);
    setReports(props.reports);
    setSortKey(props.keys[0]);
    setSortOrder("desc");
    setPage(1);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [props]);

  return (
    <>
      <Box
        mb={{ xs: 2, md: 3 }}
        maxHeight={"calc(100vh - 180px)"}
        border={1}
        borderRadius={1}
        borderColor={grey[200]}
        sx={{ overflowX: "scroll", overflowY: "scroll" }}
      >
        <table id={TABLE_ID} className={styles.table}>
          <thead>
            <tr>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleClickLabel("ticker")}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  spacing={SORT_ICON_SPACING}
                >
                  {sortKey === "ticker" && <SortIcon />}
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ textDecoration: "underline" }}
                  >
                    証券コード
                  </Typography>
                </Stack>
              </th>
              <th>
                <Typography variant="body2" textAlign="center" noWrap>
                  銘柄名
                </Typography>
              </th>
              {keys.map((key) => (
                <th
                  key={key}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleClickLabel(key)}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={SORT_ICON_SPACING}
                    minWidth={INDICATOR_MIN_WIDTH}
                  >
                    {key === sortKey && <SortIcon />}
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ textDecoration: "underline" }}
                    >
                      {INDICATORS[key]}
                    </Typography>
                  </Stack>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports
              .slice(ROWS_PER_PAGE * (page - 1), ROWS_PER_PAGE * page)
              .map((report) => (
                <tr key={report.ticker}>
                  <td>
                    <Typography variant="body2" textAlign="center" noWrap>
                      {report.ticker}
                    </Typography>
                  </td>
                  <td>
                    <Stack spacing={ROW_SPACING}>
                      <Typography fontWeight="bold" width={NAME_WIDTH} noWrap>
                        <Link
                          href={`/stocks/${report.ticker}/charts`}
                          underline="none"
                          component={NextLink}
                          target="_blank"
                        >
                          {report.Stock.name}
                        </Link>
                      </Typography>
                      <Typography
                        variant="caption"
                        color={grey[600]}
                        width={NAME_WIDTH}
                        noWrap
                      >
                        {`${formatMarket(report.Stock)} / ${report.Stock.industry}`}
                      </Typography>
                    </Stack>
                  </td>
                  {keys.map((key) => (
                    <td key={key}>
                      <Stack spacing={ROW_SPACING} alignItems="flex-end">
                        <Typography fontWeight="bold" color={grey[600]} noWrap>
                          {report[key] !== null
                            ? formatNumber(
                                adjustValue(report, key) as number,
                                indicatorToFractionDigits(key),
                              )
                            : NOT_APPLICABLE_SYMBOL}
                        </Typography>
                        <Typography variant="caption" color={grey[600]} noWrap>
                          {indicatorToUnit(key)}
                        </Typography>
                      </Stack>
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </Box>
      <Stack alignItems="center">
        <Pagination
          page={page}
          maxPage={Math.ceil(reports.length / ROWS_PER_PAGE)}
          handleChange={handleChangePagination}
        />
      </Stack>
    </>
  );
}
