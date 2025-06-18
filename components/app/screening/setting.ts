import { DIVISIONS, INDUSTRIES } from "@/lib/constants.ts";
import type { Range } from "@/lib/types.ts";

export type ListItemKey = "divisions" | "industries";

export type ListItemValue = {
  name: string;
  isActive: boolean;
}[];

export type ListItems = {
  [key in ListItemKey]: ListItemValue;
};

export type SliderItemKey =
  // 売上・利益
  | "net_sales"
  | "operating_income"
  | "actual_profit_loss"
  // 収益性
  | "roe"
  | "roa"
  // 利益率
  | "operating_income_margin"
  | "profit_loss_margin"
  // 成長率
  | "net_sales_growth_rate"
  | "profit_loss_growth_rate"
  // 短期安全性
  | "current_ratio"
  | "quick_ratio"
  | "cash_ratio"
  // 長期安全性
  | "equity_to_asset_ratio"
  | "fixed_ratio"
  // 回転性
  | "total_asset_turnover"
  | "receivables_turnover"
  | "payables_turnover"
  | "inventories_turnover"
  // 配当
  | "payout_ratio"
  | "dividend_on_equity";

export type SliderItemValue = {
  value: Range;
  limit: Range;
  isActive: boolean;
};

export type SliderItems = {
  [key in SliderItemKey]: SliderItemValue;
};

export const INITIAL_STATES: {
  list: ListItems;
  slider: SliderItems;
} = {
  list: {
    divisions: DIVISIONS.map((name) => ({
      name,
      isActive: true,
    })),
    industries: INDUSTRIES.map((name) => ({
      name,
      isActive: true,
    })),
  },
  slider: {
    // 売上・利益
    net_sales: {
      value: { min: 0, max: 1000000 },
      limit: { min: 0, max: 1000000 },
      isActive: false,
    },
    operating_income: {
      value: { min: 0, max: 100000 },
      limit: { min: 0, max: 100000 },
      isActive: false,
    },
    actual_profit_loss: {
      value: { min: 0, max: 100000 },
      limit: { min: 0, max: 100000 },
      isActive: false,
    },
    // 収益性
    roe: {
      value: { min: 0, max: 30 },
      limit: { min: 0, max: 30 },
      isActive: false,
    },
    roa: {
      value: { min: 0, max: 30 },
      limit: { min: 0, max: 30 },
      isActive: false,
    },
    // 利益率
    operating_income_margin: {
      value: { min: 0, max: 100 },
      limit: { min: 0, max: 100 },
      isActive: false,
    },
    profit_loss_margin: {
      value: { min: 0, max: 100 },
      limit: { min: 0, max: 100 },
      isActive: false,
    },
    // 成長率
    net_sales_growth_rate: {
      value: { min: 0, max: 100 },
      limit: { min: 0, max: 100 },
      isActive: false,
    },
    profit_loss_growth_rate: {
      value: { min: 0, max: 100 },
      limit: { min: 0, max: 100 },
      isActive: false,
    },
    // 短期安全性
    current_ratio: {
      value: { min: 0, max: 300 },
      limit: { min: 0, max: 300 },
      isActive: false,
    },
    quick_ratio: {
      value: { min: 0, max: 300 },
      limit: { min: 0, max: 300 },
      isActive: false,
    },
    cash_ratio: {
      value: { min: 0, max: 300 },
      limit: { min: 0, max: 300 },
      isActive: false,
    },
    // 長期安全性
    equity_to_asset_ratio: {
      value: { min: 0, max: 100 },
      limit: { min: 0, max: 100 },
      isActive: false,
    },
    fixed_ratio: {
      value: { min: 0, max: 200 },
      limit: { min: 0, max: 200 },
      isActive: false,
    },
    // 回転性
    total_asset_turnover: {
      value: { min: 0, max: 3 },
      limit: { min: 0, max: 3 },
      isActive: false,
    },
    receivables_turnover: {
      value: { min: 0, max: 365 },
      limit: { min: 0, max: 365 },
      isActive: false,
    },
    payables_turnover: {
      value: { min: 0, max: 365 },
      limit: { min: 0, max: 365 },
      isActive: false,
    },
    inventories_turnover: {
      value: { min: 0, max: 365 },
      limit: { min: 0, max: 365 },
      isActive: false,
    },
    // 配当
    payout_ratio: {
      value: { min: 0, max: 100 },
      limit: { min: 0, max: 100 },
      isActive: false,
    },
    dividend_on_equity: {
      value: { min: 0, max: 10 },
      limit: { min: 0, max: 10 },
      isActive: false,
    },
  },
};

export const SECTIONS: {
  slider: {
    name: string;
    keys: SliderItemKey[];
  }[];
} = {
  slider: [
    {
      name: "売上・利益",
      keys: ["net_sales", "operating_income", "actual_profit_loss"],
    },
    {
      name: "利益率",
      keys: ["operating_income_margin", "profit_loss_margin"],
    },
    {
      name: "成長率",
      keys: ["net_sales_growth_rate", "profit_loss_growth_rate"],
    },
    {
      name: "収益性",
      keys: ["roe", "roa"],
    },
    {
      name: "短期安全性",
      keys: ["current_ratio", "quick_ratio", "cash_ratio"],
    },
    {
      name: "長期安全性",
      keys: ["equity_to_asset_ratio", "fixed_ratio"],
    },
    {
      name: "回転性",
      keys: [
        "total_asset_turnover",
        "receivables_turnover",
        "payables_turnover",
        "inventories_turnover",
      ],
    },
    {
      name: "配当",
      keys: ["payout_ratio", "dividend_on_equity"],
    },
  ],
};
