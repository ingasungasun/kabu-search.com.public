"use client";

import React from "react";
import dayjs from "dayjs";
import {
  Chart as Registerer,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Report } from "@prisma/client";
import { INDICATORS, NOT_APPLICABLE_SYMBOL, Unit } from "@/lib/constants.ts";
import {
  indicatorToUnit,
  indicatorToFractionDigits,
  adjustValue,
  formatNumber,
} from "@/lib/functions.ts";
import type { ChartView, IndicatorKey } from "@/lib/types.ts";

Registerer.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
);

const PALETTE = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];
const border = {
  color: "#999",
  dash: [1, 1],
};
const grid = {
  color: "#ddd",
};
const DEFAULT_ASPECT_RATIO = 1.4;

export default function ChartJS(props: {
  chartView: ChartView;
  reports: Report[];
  aspectRatio?: number;
}) {
  const { chartView, reports, aspectRatio } = props;
  const indicatorKey = chartView.keys[0] as IndicatorKey;
  const fractionDigits = indicatorToFractionDigits(indicatorKey);
  const unit = indicatorToUnit(indicatorKey);

  return (
    <Chart
      type={chartView.type}
      data={{
        labels: reports.map((report) => report.period_end),
        datasets: chartView.keys.map((key, index) => ({
          label: INDICATORS[key as IndicatorKey],
          data: reports.map((report) =>
            adjustValue(report, key as IndicatorKey),
          ),
          borderColor: PALETTE[index % PALETTE.length],
          backgroundColor: PALETTE[index % PALETTE.length],
        })),
      }}
      options={{
        aspectRatio: aspectRatio ?? DEFAULT_ASPECT_RATIO,
        datasets: {
          line: {
            cubicInterpolationMode: "monotone",
            pointBackgroundColor: "#fff",
            pointRadius: 4,
          },
        },
        scales: {
          x: {
            border,
            grid,
            ticks: {
              minRotation: 0,
              maxRotation: 0,
              callback: (value, index) =>
                dayjs(reports[index].period_end).format("YYYY"),
            },
          },
          y: {
            border,
            grid,
            ticks: {
              callback: (value) => {
                switch (unit) {
                  case Unit.MillionYen:
                  case Unit.ThousandYen:
                    return formatNumber(Number(value));
                  default:
                    return formatNumber(Number(value)) + unit;
                }
              },
            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              font: {
                size: 15,
              },
              padding: 10,
            },
          },
          tooltip: {
            callbacks: {
              title: (context) => dayjs(context[0].label).format("YYYY年M月期"),
              label: (context) => {
                const value =
                  typeof context.parsed.y === "number"
                    ? formatNumber(context.parsed.y, fractionDigits) + unit
                    : NOT_APPLICABLE_SYMBOL;

                return `${context.dataset.label}: ${value}`;
              },
            },
            mode: "index",
            intersect: false,
          },
        },
      }}
    />
  );
}
