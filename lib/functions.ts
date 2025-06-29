import { NextRequest } from "next/server";
import { Prisma, Stock, Report } from "@prisma/client";
import { prisma } from "@/lib/prisma-client.ts";
import validator from "email-validator";
import { grey } from "@mui/material/colors";
import {
  CHARACTER_LIMITS,
  ERROR_MESSAGES,
  LOCALHOST,
  Unit,
} from "@/lib/constants.ts";
import type { IndicatorKey, Validation } from "@/lib/types.ts";

export function getIPAddress(request: NextRequest) {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  return xForwardedFor ? xForwardedFor.split(",")[0].trim() : "";
}

export function formatPositiveNumber(
  num: string | undefined | null,
  defaultNum = 1,
) {
  if (typeof num === "string" && /^[1-9]\d*$/.test(num)) {
    return Math.min(Number(num), Number.MAX_SAFE_INTEGER);
  }

  return defaultNum;
}

export async function suggestStocks(query: string, count: number) {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < CHARACTER_LIMITS.searchQuery.min) {
    throw new Error(
      `${CHARACTER_LIMITS.searchQuery.min}文字以上で入力してください`,
    );
  }

  if (trimmedQuery.length > CHARACTER_LIMITS.searchQuery.max) {
    throw new Error(
      `${CHARACTER_LIMITS.searchQuery.max}文字以内で入力してください`,
    );
  }

  if (trimmedQuery.match(/^[1-9][\dA-Z]{0,3}$/)) {
    return prisma.stock.findMany({
      where: {
        ticker: {
          startsWith: trimmedQuery,
        },
      },
      orderBy: {
        ticker: "asc",
      },
      take: count,
    });
  }

  const words = trimmedQuery.split(/\s+/g);
  const AND: Prisma.StockWhereInput[] = [];

  words.forEach((word) => {
    const OR: Prisma.StockWhereInput[] = [];
    OR.push({ name: { contains: word } });
    OR.push({ kana_name: { contains: word } });

    if (word.match(/にほん/)) {
      OR.push({ kana_name: { contains: word.replace(/にほん/g, "にっぽん") } });
    }

    if (word.match(/ニホン/)) {
      OR.push({ kana_name: { contains: word.replace(/ニホン/g, "ニッポン") } });
    }

    if (word.match(/にっぽん/)) {
      OR.push({ kana_name: { contains: word.replace(/にっぽん/g, "にほん") } });
    }

    if (word.match(/ニッポン/)) {
      OR.push({ kana_name: { contains: word.replace(/ニッポン/g, "ニホン") } });
    }

    AND.push({ OR });
  });

  return prisma.stock.findMany({
    where: {
      AND,
    },
    orderBy: {
      ticker: "asc",
    },
    take: count,
  });
}

export function parseBigintToNumber(obj: object | null) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
}

export async function fetchStock(ticker: string) {
  const url = `${LOCALHOST}/api/stocks/${ticker}`;
  const res = await fetch(url);

  if (res.ok) {
    const result = await res.json();
    return result.stock as Stock | null;
  }

  return null;
}

export async function fetchReport(ticker: string, periodEnd: string) {
  const url = `${LOCALHOST}/api/reports/${ticker}/${periodEnd}`;
  const res = await fetch(url);

  if (res.ok) {
    const result = await res.json();
    return result.report as Report | null;
  }

  return null;
}

export async function fetchReports(ticker: string) {
  const url = `${LOCALHOST}/api/reports/${ticker}`;
  const res = await fetch(url);

  if (res.ok) {
    const result = await res.json();
    return result.reports as Report[];
  }

  return null;
}

export function indicatorToUnit(key: IndicatorKey) {
  switch (key) {
    case "eps":
    case "bps":
    case "dividend_paid_per_share":
      return Unit.Yen;

    case "net_sales_per_employee":
    case "profit_loss_per_employee":
      return Unit.ThousandYen;

    case "net_sales":
    case "cost_of_sales":
    case "gross_profit":
    case "sga":
    case "operating_income":
    case "non_operating_income":
    case "non_operating_expenses":
    case "ordinary_income":
    case "extraordinary_income":
    case "extraordinary_loss":
    case "profit_loss_before_tax":
    case "income_tax":
    case "profit_loss":
    case "income_before_minority_interests":
    case "profit_loss_attributable_to_owners_of_parent":
    case "profit_loss_attributable_to_non_controlling_interests":
    case "actual_profit_loss":
    case "assets":
    case "current_assets":
    case "cash_and_deposits":
    case "notes_and_accounts_receivable":
    case "inventories":
    case "non_current_assets":
    case "liabilities":
    case "current_liabilities":
    case "notes_and_accounts_payable":
    case "non_current_liabilities":
    case "net_assets":
    case "share_capital":
    case "capital_surplus":
    case "retained_earnings":
    case "treasury_shares":
    case "equity_attributable_to_owners_of_parent":
    case "non_controlling_interests":
    case "operating_cash_flow":
    case "investing_cash_flow":
    case "financing_cash_flow":
    case "free_cash_flow":
      return Unit.MillionYen;

    case "per":
    case "pbr":
      return Unit.Ratio;

    case "net_sales_growth_rate":
    case "profit_loss_growth_rate":
    case "roe":
    case "roa":
    case "gross_profit_margin":
    case "operating_income_margin":
    case "ordinary_income_margin":
    case "profit_loss_margin":
    case "current_ratio":
    case "quick_ratio":
    case "cash_ratio":
    case "fixed_ratio":
    case "fixed_long_term_conformity_ratio":
    case "equity_to_asset_ratio":
    case "payout_ratio":
    case "dividend_on_equity":
    case "dividend_yield":
      return Unit.Percentage;

    case "total_asset_turnover":
      return Unit.Times;

    case "receivables_turnover":
    case "payables_turnover":
    case "inventories_turnover":
      return Unit.Day;

    case "issued_shares":
      return Unit.Share;

    case "number_of_employees":
      return Unit.Person;

    default:
      return Unit.Yen;
  }
}

export function indicatorToFractionDigits(key: IndicatorKey) {
  switch (key) {
    case "net_sales_growth_rate":
    case "profit_loss_growth_rate":
    case "per":
    case "pbr":
    case "eps":
    case "bps":
    case "roe":
    case "roa":
    case "gross_profit_margin":
    case "operating_income_margin":
    case "ordinary_income_margin":
    case "profit_loss_margin":
    case "current_ratio":
    case "quick_ratio":
    case "cash_ratio":
    case "fixed_ratio":
    case "fixed_long_term_conformity_ratio":
    case "equity_to_asset_ratio":
    case "total_asset_turnover":
    case "receivables_turnover":
    case "payables_turnover":
    case "inventories_turnover":
    case "dividend_paid_per_share":
    case "payout_ratio":
    case "dividend_on_equity":
    case "dividend_yield":
      return 1;

    default:
      return 0;
  }
}

export function adjustValue(report: Report, key: IndicatorKey) {
  const value = report[key];

  if (typeof value === "number" || typeof value === "bigint") {
    const num = Number(value);
    const unit = indicatorToUnit(key);

    switch (unit) {
      case Unit.Percentage:
        return num * 100;

      case Unit.ThousandYen:
        return Math.floor(num / 1000);

      case Unit.MillionYen:
        return Math.floor(num / 1000000);

      default:
        return num;
    }
  }

  return null;
}

export function formatNumber(num: number | bigint, fractionDigits = 0) {
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function validateEmail(value: string): Validation {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return {
      message: ERROR_MESSAGES.contact.email.empty,
      isValid: false,
    };
  }

  if (!validator.validate(trimmed)) {
    return {
      message: ERROR_MESSAGES.contact.email.invalid,
      isValid: false,
    };
  }

  return {
    message: "",
    isValid: true,
  };
}

export function validateSubject(value: string): Validation {
  const trimmed = value.trim();

  if (trimmed.length < CHARACTER_LIMITS.contact.subject.min) {
    return {
      message: ERROR_MESSAGES.contact.subject.min,
      isValid: false,
    };
  }

  if (trimmed.length > CHARACTER_LIMITS.contact.subject.max) {
    return {
      message: ERROR_MESSAGES.contact.subject.max,
      isValid: false,
    };
  }

  return {
    message: "",
    isValid: true,
  };
}

export function validateText(value: string): Validation {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return {
      message: ERROR_MESSAGES.contact.text.empty,
      isValid: false,
    };
  }

  if (trimmed.length < CHARACTER_LIMITS.contact.text.min) {
    return {
      message: ERROR_MESSAGES.contact.text.min,
      isValid: false,
    };
  }

  if (trimmed.length > CHARACTER_LIMITS.contact.text.max) {
    return {
      message: ERROR_MESSAGES.contact.text.max,
      isValid: false,
    };
  }

  return {
    message: "",
    isValid: true,
  };
}

export function slashStyle(spacing = 0) {
  return {
    "&::after": {
      paddingLeft: spacing,
      content: "'/'",
      fontWeight: "normal",
      color: grey[600],
    },
  };
}
