import { Prisma, Report } from "@prisma/client";
import { INDICATORS, CHART_VIEWS } from "@/lib/constants.ts";

export type ReportWithStock = Prisma.ReportGetPayload<{
  include: {
    Stock: true;
  };
}>;

export type StockWithReports = Prisma.StockGetPayload<{
  include: {
    Reports: true;
  };
}>;

export type Range = {
  min: number;
  max: number;
};

export type Validation = {
  message: string;
  isValid: boolean;
};

export type ContactForm = {
  email: Validation;
  subject: Validation;
  text: Validation;
};

export type ChartView = {
  label: string;
  keys: (keyof Report)[];
  type: "bar" | "line";
};

export type SnackbarState = {
  open: boolean;
  severity: "error" | "info" | "success" | "warning";
  anchorOrigin?: {
    vertical?: "top" | "bottom";
    horizontal?: "right" | "left" | "center";
  };
  autoHideDuration?: number;
  message: string;
};

export type ChartViewKey = keyof typeof CHART_VIEWS;

export type IndicatorKey = keyof typeof INDICATORS;
