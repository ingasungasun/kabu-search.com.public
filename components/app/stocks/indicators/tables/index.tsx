import React from "react";
import { Report } from "@prisma/client";
import {
  Box,
  Stack,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Heading from "@/components/heading/index.tsx";
import DisplayAd from "@/components/adsense/display-ad/index.tsx";
import { INDICATORS, NOT_APPLICABLE_SYMBOL } from "@/lib/constants.ts";
import {
  adjustValue,
  formatNumber,
  indicatorToUnit,
  indicatorToFractionDigits,
} from "@/lib/functions.ts";
import type { IndicatorKey } from "@/lib/types.ts";

export default function Tables(props: { report: Report }) {
  const { report } = props;

  const sections: {
    title: string;
    keys: IndicatorKey[];
  }[] = [
    {
      title: "売上・利益",
      keys: [
        "net_sales",
        "gross_profit",
        "operating_income",
        "ordinary_income",
        "actual_profit_loss",
      ],
    },
    {
      title: "1人当たり売上・利益",
      keys: ["net_sales_per_employee", "profit_loss_per_employee"],
    },
    {
      title: "キャッシュフロー",
      keys: [
        "operating_cash_flow",
        "investing_cash_flow",
        "financing_cash_flow",
        "free_cash_flow",
      ],
    },
    {
      title: "利益率",
      keys: [
        "gross_profit_margin",
        "operating_income_margin",
        "ordinary_income_margin",
        "profit_loss_margin",
      ],
    },
    {
      title: "成長率",
      keys: ["net_sales_growth_rate", "profit_loss_growth_rate"],
    },
    {
      title: "収益性",
      keys: ["roe", "roa"],
    },
    {
      title: "短期安全性",
      keys: ["current_ratio", "quick_ratio", "cash_ratio"],
    },
    {
      title: "長期安全性",
      keys: [
        "equity_to_asset_ratio",
        "fixed_ratio",
        "fixed_long_term_conformity_ratio",
      ],
    },
    {
      title: "回転性",
      keys: [
        "total_asset_turnover",
        "receivables_turnover",
        "payables_turnover",
        "inventories_turnover",
      ],
    },
    {
      title: "割安性",
      keys: ["per", "pbr", "eps", "bps"],
    },
    {
      title: "配当",
      keys: [
        "dividend_paid_per_share",
        "payout_ratio",
        "dividend_on_equity",
        "dividend_yield",
      ],
    },
    {
      title: "その他",
      keys: ["treasury_shares", "number_of_employees"],
    },
  ];

  return (
    <Grid container columnSpacing={2} rowSpacing={{ xs: 5, sm: 6, md: 6 }}>
      {sections.map((section, index) => (
        <React.Fragment key={index}>
          <Grid component="section" size={{ xs: 12, sm: 6, md: 4 }}>
            <Box mb={{ xs: 1, md: 2 }}>
              <Heading component="h3" fontWeight="bold" textAlign="center">
                {section.title}
              </Heading>
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table aria-label={section.title}>
                <TableBody>
                  {section.keys.map((key) => (
                    <TableRow key={key}>
                      <TableCell align="left">
                        <Heading component="h4" variant="body1">
                          {INDICATORS[key]}
                        </Heading>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="right"
                          spacing={0.5}
                        >
                          <Typography
                            component="span"
                            variant="h6"
                            fontWeight="bold"
                          >
                            {report[key] !== null &&
                              formatNumber(
                                adjustValue(report, key) as number,
                                indicatorToFractionDigits(key),
                              )}
                          </Typography>
                          <Typography>
                            {report[key] !== null
                              ? indicatorToUnit(key)
                              : NOT_APPLICABLE_SYMBOL}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {index === 5 && (
            <Grid size={12}>
              <DisplayAd unit="stocks_indicators_1" />
            </Grid>
          )}
          {index === 11 && (
            <Grid size={12}>
              <DisplayAd unit="stocks_indicators_9" />
            </Grid>
          )}
        </React.Fragment>
      ))}
    </Grid>
  );
}
