import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma-client.ts";
import { PARAM_KEYS, ITEMS_PER_PAGE, INDUSTRIES } from "@/lib/constants.ts";
import { parseBigintToNumber, formatPositiveNumber } from "@/lib/functions.ts";
import type { StockWithReports } from "@/lib/types.ts";

/*
  eslint-disable-next-line import/prefer-default-export --
  This is a specification of Next.js.
  */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const market = searchParams.get(PARAM_KEYS.charts.market);
  const industry = searchParams.get(PARAM_KEYS.charts.industry);
  const sort = searchParams.get(PARAM_KEYS.charts.sort);
  const increased = searchParams.get(PARAM_KEYS.charts.increased);
  const notIncreased = searchParams.get(PARAM_KEYS.charts.not_increased);
  const page = formatPositiveNumber(searchParams.get(PARAM_KEYS.charts.page));

  const STOCK_WHERE: Prisma.StockWhereInput[] = [];
  const REPORT_WHERE: Prisma.ReportWhereInput[] = [];
  const REPORT_ORDER_BY: Prisma.ReportOrderByWithRelationInput[] = [];

  try {
    if (typeof market === "string") {
      switch (market) {
        case "東証プライム":
          STOCK_WHERE.push({ market: "東証" });
          STOCK_WHERE.push({ division: "プライム" });
          break;

        case "東証スタンダード":
          STOCK_WHERE.push({ market: "東証" });
          STOCK_WHERE.push({ division: "スタンダード" });
          break;

        case "東証グロース":
          STOCK_WHERE.push({ market: "東証" });
          STOCK_WHERE.push({ division: "グロース" });
          break;

        case "名証":
          STOCK_WHERE.push({ market: "名証" });
          break;

        case "札証":
          STOCK_WHERE.push({ market: "札証" });
          break;

        case "福証":
          STOCK_WHERE.push({ market: "福証" });
          break;

        default:
          break;
      }
    }

    if (typeof industry === "string" && INDUSTRIES.includes(industry)) {
      STOCK_WHERE.push({ industry });
    }

    if (typeof sort === "string") {
      switch (sort) {
        case "period_end":
          REPORT_ORDER_BY.push({ period_end: "desc" });
          REPORT_ORDER_BY.push({ id: "desc" });
          break;

        case "ticker":
          REPORT_ORDER_BY.push({ ticker: "asc" });
          REPORT_ORDER_BY.push({ id: "desc" });
          break;

        case "net_sales":
        case "operating_income":
        case "actual_profit_loss":
          REPORT_ORDER_BY.push({
            [sort]: {
              sort: "desc",
              nulls: "last",
            },
          });
          REPORT_ORDER_BY.push({ id: "desc" });
          break;

        default:
          break;
      }
    } else {
      REPORT_ORDER_BY.push({ period_end: "desc" });
      REPORT_ORDER_BY.push({ id: "desc" });
    }

    if (typeof increased === "string") {
      REPORT_WHERE.push({ net_sales_growth_rate: { gt: 0 } });
      REPORT_WHERE.push({ profit_loss_growth_rate: { gt: 0 } });
    } else if (typeof notIncreased === "string") {
      REPORT_WHERE.push({
        OR: [
          { net_sales_growth_rate: { not: { gt: 0 } } },
          { profit_loss_growth_rate: { not: { gt: 0 } } },
        ],
      });
    }

    const tempStocks = await prisma.stock.findMany({
      select: {
        ticker: true,
      },
      where: {
        AND: STOCK_WHERE,
      },
    });

    const tickers = tempStocks.map((stock) => stock.ticker);

    const reports = await prisma.report.findMany({
      include: {
        Stock: {
          include: {
            Reports: {
              select: {
                period_end: true,
                net_sales: true,
                operating_income: true,
                actual_profit_loss: true,
              },
              orderBy: {
                period_end: "asc",
              },
            },
          },
        },
      },
      where: {
        AND: [
          {
            ticker: {
              in: tickers,
            },
          },
          {
            is_newest: true,
          },
          ...REPORT_WHERE,
        ],
      },
      orderBy: REPORT_ORDER_BY,
      take: ITEMS_PER_PAGE.charts,
      skip: (page - 1) * ITEMS_PER_PAGE.charts,
    });

    const aggregations = await prisma.report.aggregate({
      _count: {
        _all: true,
      },
      where: {
        AND: [
          {
            ticker: {
              in: tickers,
            },
          },
          {
            is_newest: true,
          },
          ...REPORT_WHERE,
        ],
      },
    });

    const stocks: StockWithReports[] = reports.map(
      (report) => report.Stock as StockWithReports,
    );

    return NextResponse.json({
      stocks: parseBigintToNumber(stocks),
      /*
      eslint-disable-next-line no-underscore-dangle --
      This is a specification of Prisma.
      */
      totalItems: aggregations._count._all,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new NextResponse(message, {
      status: 400,
    });
  }
}
