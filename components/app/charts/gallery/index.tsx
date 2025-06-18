"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Report } from "@prisma/client";
import {
  Grid,
  Box,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import CustomSelect from "@/components/custom-select/index.tsx";
import GalleryItem from "@/components/app/charts/gallery-item/index.tsx";
import Pagination from "@/components/pagination/index.tsx";
import DisplayAd from "@/components/adsense/display-ad/index.tsx";
import {
  CHART_VIEWS,
  PARAM_KEYS,
  INDICATORS,
  DIVISIONS,
  INDUSTRIES,
  SORTS_IN_CHARTS,
  ITEMS_PER_PAGE,
} from "@/lib/constants.ts";
import type { StockWithReports, IndicatorKey } from "@/lib/types.ts";

export default function Gallery(props: {
  market?: string;
  industry?: string;
  sort?: keyof Report;
  increased: boolean;
  page: number;
  maxPage: number;
  stocks: StockWithReports[];
}) {
  const { maxPage, stocks } = props;

  const [market, setMarket] = useState(props.market);
  const [industry, setIndustry] = useState(props.industry);
  const [sort, setSort] = useState(props.sort);
  const [increased, setIncreased] = useState(props.increased);
  const [page, setPage] = useState(props.page);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  function handleChangeMarket(value: string) {
    setMarket(value);
    setPage(1);
    setIsLoading(true);
  }

  function handleChangeIndustry(value: string) {
    setIndustry(value);
    setPage(1);
    setIsLoading(true);
  }

  function handleChangeSort(value: string) {
    setSort(value as keyof Report);
    setPage(1);
    setIsLoading(true);
  }

  function onChangeIncreased(event: React.ChangeEvent<HTMLInputElement>) {
    setIncreased(event.target.checked);
    setPage(1);
    setIsLoading(true);
  }

  function handleChangePage(value: number) {
    setPage(value);
    setIsLoading(true);
  }

  function reload() {
    let url = pathname;
    const temp = new URLSearchParams();

    if (typeof market === "string" && DIVISIONS.includes(market)) {
      temp.set(PARAM_KEYS.charts.market, market);
    }

    if (typeof industry === "string" && INDUSTRIES.includes(industry)) {
      temp.set(PARAM_KEYS.charts.industry, industry);
    }

    if (typeof sort === "string" && SORTS_IN_CHARTS.slice(1).includes(sort)) {
      temp.set(PARAM_KEYS.charts.sort, sort);
    }

    if (increased) {
      temp.set(PARAM_KEYS.charts.increased, "true");
    }

    if (page > 1) {
      temp.set(PARAM_KEYS.charts.page, String(page));
    }

    if (temp.size > 0) {
      url += `?${temp.toString()}`;
    }

    router.push(url);
  }

  useEffect(() => {
    if (
      market !== props.market ||
      industry !== props.industry ||
      sort !== props.sort ||
      increased !== props.increased ||
      page !== props.page
    ) {
      reload();
    }
    /*
    eslint-disable-next-line react-hooks/exhaustive-deps --
    This is unnecessary.
    */
  }, [market, industry, sort, increased, page]);

  useEffect(() => {
    setMarket(props.market);
    setIndustry(props.industry);
    setSort(props.sort);
    setIncreased(props.increased);
    setPage(props.page);
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

    if (stocks.length === 0) {
      return <Typography variant="large">銘柄が存在しません</Typography>;
    }

    return (
      <>
        <Grid
          mb={{ xs: 3, sm: 4 }}
          container
          columnSpacing={3}
          rowSpacing={{ xs: 6, sm: 8, lg: 8 }}
        >
          {stocks.map((stock, index) => (
            <React.Fragment key={stock.id}>
              <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                <GalleryItem stock={stock} chartView={CHART_VIEWS.net_sales} />
              </Grid>
              {stocks.length === ITEMS_PER_PAGE.charts && index === 5 && (
                <Grid size={12}>
                  <DisplayAd unit="charts_1" />
                </Grid>
              )}
            </React.Fragment>
          ))}
        </Grid>
        <Stack mb={{ xs: 4, sm: 6, md: 6 }} alignItems="center">
          <Pagination
            page={page}
            maxPage={maxPage}
            handleChange={handleChangePage}
          />
        </Stack>
        <Box>
          <DisplayAd unit="charts_9" />
        </Box>
      </>
    );
  }

  return (
    <>
      <Grid mb={2} container columnSpacing={1} rowSpacing={2}>
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
            label="並べ替え"
            selected={
              typeof sort === "string" && SORTS_IN_CHARTS.includes(sort)
                ? sort
                : SORTS_IN_CHARTS[0]
            }
            values={SORTS_IN_CHARTS}
            formatter={(value) => {
              switch (value) {
                case "period_end":
                  return "決算が新しい";

                case "ticker":
                  return "証券コード";

                default:
                  return INDICATORS[value as IndicatorKey];
              }
            }}
            handleChange={handleChangeSort}
          />
        </Grid>
      </Grid>
      <Box mb={6}>
        <FormControlLabel
          control={
            <Checkbox checked={increased} onChange={onChangeIncreased} />
          }
          label={<Typography variant="large">増収増益のみ</Typography>}
        />
      </Box>
      <Show />
    </>
  );
}
