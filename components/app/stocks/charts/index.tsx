import React from "react";
import { Box, Grid } from "@mui/material";
import { Report } from "@prisma/client";
import ChartJS from "@/components/chart-js/index.tsx";
import Heading from "@/components/heading/index.tsx";
import DisplayAd from "@/components/adsense/display-ad/index.tsx";
import { CHART_VIEWS } from "@/lib/constants.ts";

const chartViews = [
  CHART_VIEWS.net_sales,
  CHART_VIEWS.net_sales_per_employee,
  CHART_VIEWS.cash_flow,
  CHART_VIEWS.profit_margin,
  CHART_VIEWS.growth_rate,
  CHART_VIEWS.return,
  CHART_VIEWS.short_term_safety,
  CHART_VIEWS.long_term_safety,
  CHART_VIEWS.turnover,
  CHART_VIEWS.price_ratio,
  CHART_VIEWS.dividend,
  CHART_VIEWS.number_of_employees,
];

export default function Charts(props: { reports: Report[] }) {
  const { reports } = props;

  return (
    <Grid container columnSpacing={3} rowSpacing={{ xs: 5, sm: 5, lg: 6 }}>
      {chartViews.map((chartView, index) => (
        <React.Fragment key={chartView.keys[0]}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Box mb={1} textAlign="center">
              <Heading component="h3" fontWeight="bold">
                {chartView.label}
              </Heading>
            </Box>
            <ChartJS chartView={chartView} reports={reports} />
          </Grid>
          {index === 5 && (
            <Grid size={12}>
              <DisplayAd unit="stocks_charts_1" />
            </Grid>
          )}
          {index === 11 && (
            <Grid size={12}>
              <DisplayAd unit="stocks_charts_9" />
            </Grid>
          )}
        </React.Fragment>
      ))}
    </Grid>
  );
}
