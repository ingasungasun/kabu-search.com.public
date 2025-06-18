"use client";

import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Report } from "@prisma/client";
import {
  Box,
  Stack,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Link,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import CustomSelect from "@/components/custom-select/index.tsx";
import Pagination from "@/components/pagination/index.tsx";
import DisplayAd from "@/components/adsense/display-ad/index.tsx";
import {
  PARAM_KEYS,
  ITEMS_PER_PAGE,
  INDICATORS,
  DIVISIONS,
  INDUSTRIES,
  SORTS_IN_RANKING,
} from "@/lib/constants.ts";
import {
  adjustValue,
  formatNumber,
  indicatorToUnit,
  indicatorToFractionDigits,
} from "@/lib/functions.ts";
import type { IndicatorKey, ReportWithStock } from "@/lib/types.ts";

export default function CustomTable(props: {
  market?: string;
  industry?: string;
  sort?: keyof Report;
  reports: ReportWithStock[];
}) {
  const { reports } = props;
  const key = (props.sort ?? SORTS_IN_RANKING[0]) as IndicatorKey;
  const maxPage = Math.ceil(reports.length / ITEMS_PER_PAGE.ranking);

  const [market, setMarket] = useState(props.market);
  const [industry, setIndustry] = useState(props.industry);
  const [sort, setSort] = useState(props.sort);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  function handleChangeMarket(value: string) {
    setMarket(value);
    setIsLoading(true);
  }

  function handleChangeIndustry(value: string) {
    setIndustry(value);
    setIsLoading(true);
  }

  function handleChangeSort(value: string) {
    setSort(value as IndicatorKey);
    setIsLoading(true);
  }

  function handleChangePage(value: number) {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
    setPage(value);
  }

  function order(index: number) {
    return (index + 1 + ITEMS_PER_PAGE.ranking * (page - 1)).toLocaleString();
  }

  function reload() {
    let url = pathname;
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

    router.push(url, {
      scroll: false,
    });
  }

  useEffect(() => {
    if (
      market !== props.market ||
      industry !== props.industry ||
      sort !== props.sort
    ) {
      reload();
    }
    /*
    eslint-disable-next-line react-hooks/exhaustive-deps --
    This is unnecessary.
    */
  }, [market, industry, sort]);

  useEffect(() => {
    setMarket(props.market);
    setIndustry(props.industry);
    setSort(props.sort);
    setPage(1);
    setIsLoading(false);
  }, [props]);

  function Show() {
    if (isLoading) {
      return (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      );
    }

    if (reports.length === 0) {
      return (
        <Typography variant="large">表示できる銘柄が存在しません</Typography>
      );
    }

    return (
      <>
        <Stack mb={4} width="600px" maxWidth="100%">
          <Box mb={1}>
            <Box mb={0.5}>
              <Typography textAlign="center">{INDICATORS[key]}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" textAlign="center">
                （単位: {indicatorToUnit(key)}）
              </Typography>
            </Box>
          </Box>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ maxWidth: 600 }}
          >
            <Table aria-label={INDICATORS[key]}>
              <TableBody>
                {reports
                  .slice(
                    ITEMS_PER_PAGE.ranking * (page - 1),
                    ITEMS_PER_PAGE.ranking * page,
                  )
                  .map((report, index) => (
                    <TableRow key={report.id}>
                      <TableCell
                        align="center"
                        sx={{
                          paddingLeft: { xs: 1, sm: 2 },
                          paddingRight: { xs: 1, sm: 2 },
                          width: { xs: 50, sm: 60 },
                          background: grey[100],
                        }}
                      >
                        <Typography
                          component="span"
                          variant="h6"
                          fontWeight="bold"
                          color={grey[400]}
                        >
                          {order(index)}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          paddingLeft: { xs: 1, sm: 2 },
                          paddingRight: { xs: 1, sm: 2 },
                        }}
                      >
                        <Box mb={0.3}>
                          <Link
                            component={NextLink}
                            href={`/stocks/${report.Stock.ticker}/charts`}
                            underline="none"
                          >
                            <Typography>{report.Stock.name}</Typography>
                          </Link>
                        </Box>
                        <Grid container rowSpacing={0.2} columnSpacing={1.5}>
                          <Grid>
                            <Typography variant="body2" color={grey[500]}>
                              {report.Stock.ticker}
                            </Typography>
                          </Grid>
                          <Grid>
                            <Typography variant="body2" color={grey[500]}>
                              {report.Stock.industry !== ""
                                ? report.Stock.industry
                                : report.Stock.division}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          paddingLeft: { xs: 1, sm: 2 },
                          paddingRight: { xs: 1, sm: 2 },
                        }}
                      >
                        <Typography
                          component="span"
                          variant="h6"
                          fontWeight="normal"
                          noWrap
                        >
                          {formatNumber(
                            adjustValue(report, key) as number,
                            indicatorToFractionDigits(key),
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack mt={3} alignItems="center">
            <Pagination
              page={page}
              maxPage={maxPage}
              handleChange={handleChangePage}
            />
          </Stack>
        </Stack>
        <Box>
          <DisplayAd unit="ranking_9" />
        </Box>
      </>
    );
  }

  return (
    <>
      <Grid container mb={4} columnSpacing={1} rowSpacing={2}>
        <Grid>
          <CustomSelect
            label="市場"
            selected={
              typeof market === "string" && DIVISIONS.includes(market)
                ? market
                : "すべて"
            }
            values={["すべて", ...DIVISIONS]}
            handleChange={handleChangeMarket}
          />
        </Grid>
        <Grid>
          <CustomSelect
            label="業種"
            selected={
              typeof industry === "string" && INDUSTRIES.includes(industry)
                ? industry
                : "すべて"
            }
            values={["すべて", ...INDUSTRIES]}
            handleChange={handleChangeIndustry}
          />
        </Grid>
        <Grid>
          <CustomSelect
            label="指標"
            selected={
              typeof sort === "string" && SORTS_IN_RANKING.includes(sort)
                ? sort
                : SORTS_IN_RANKING[0]
            }
            values={SORTS_IN_RANKING}
            formatter={(value) => INDICATORS[value as IndicatorKey]}
            handleChange={handleChangeSort}
          />
        </Grid>
      </Grid>
      <Show />
    </>
  );
}
