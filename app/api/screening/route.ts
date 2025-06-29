import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma-client.ts";
import {
  INDICATORS,
  DIVISIONS,
  INDUSTRIES,
  PARAM_KEYS,
  PARAM_DELIMITER,
} from "@/lib/constants.ts";
import { parseBigintToNumber } from "@/lib/functions.ts";

/*
  eslint-disable-next-line import/prefer-default-export --
  This is a specification of Next.js.
  */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const indicators = searchParams.get(PARAM_KEYS.screening.indicators);
  const divisions = searchParams.get(PARAM_KEYS.screening.divisions);
  const industries = searchParams.get(PARAM_KEYS.screening.industries);

  const REPORT_SELECT: Prisma.ReportSelect = {};
  const REPORT_WHERE: Prisma.ReportWhereInput[] = [];
  const STOCK_WHERE_DIVISION: Prisma.StockWhereInput[] = [];
  const STOCK_WHERE_INDUSTRY: Prisma.StockWhereInput[] = [];

  try {
    if (indicators === null || divisions === null || industries === null) {
      throw new Error("パラメータの値が不正です");
    }

    const indicatorKeys = indicators
      .split(PARAM_DELIMITER)
      .filter((key) => key in INDICATORS);

    const divisionIndexes = divisions
      .split(PARAM_DELIMITER)
      .map((index) => Number(index))
      .filter((index) => index >= 0 && index <= DIVISIONS.length - 1);

    const industryIndexes = industries
      .split(PARAM_DELIMITER)
      .map((index) => Number(index))
      .filter((index) => index >= 0 && index <= INDUSTRIES.length - 1);

    if (
      indicatorKeys.length === 0 ||
      divisionIndexes.length === 0 ||
      industryIndexes.length === 0
    ) {
      throw new Error("パラメータの値が不正です");
    }

    /**
     * indicatorKeys
     */
    indicatorKeys.forEach((key) => {
      REPORT_SELECT[key as keyof Prisma.ReportSelect] = true;
      REPORT_WHERE.push({
        NOT: {
          [key]: null,
        },
      });

      const minKey = `min_${key}`;
      const maxKey = `max_${key}`;

      if (searchParams.has(minKey)) {
        const min = Number(searchParams.get(minKey));

        REPORT_WHERE.push({
          [key]: {
            gte: min,
          },
        });
      }

      if (searchParams.has(maxKey)) {
        const max = Number(searchParams.get(maxKey));

        REPORT_WHERE.push({
          [key]: {
            lte: max,
          },
        });
      }
    });

    /**
     * divisionIndexes
     */
    divisionIndexes.forEach((index) => {
      const division = DIVISIONS[index];

      switch (division) {
        case "東証プライム":
          STOCK_WHERE_DIVISION.push({
            market: "東証",
            division: "プライム",
          });
          break;

        case "東証スタンダード":
          STOCK_WHERE_DIVISION.push({
            market: "東証",
            division: "スタンダード",
          });
          break;

        case "東証グロース":
          STOCK_WHERE_DIVISION.push({
            market: "東証",
            division: "グロース",
          });
          break;

        case "名証":
          STOCK_WHERE_DIVISION.push({
            market: "名証",
          });
          break;

        case "札証":
          STOCK_WHERE_DIVISION.push({
            market: "札証",
          });
          break;

        case "福証":
          STOCK_WHERE_DIVISION.push({
            market: "福証",
          });
          break;

        default:
      }
    });

    /**
     * industryIndexes
     */
    industryIndexes.forEach((index) => {
      const industry = INDUSTRIES[index];

      STOCK_WHERE_INDUSTRY.push({
        industry,
      });
    });

    /**
     * stocks
     */
    const stocks = await prisma.stock.findMany({
      select: {
        ticker: true,
      },
      where: {
        AND: [
          {
            OR: STOCK_WHERE_DIVISION,
          },
          {
            OR: STOCK_WHERE_INDUSTRY,
          },
        ],
      },
    });

    const tickers = stocks.map((stock) => stock.ticker);

    /**
     * reports
     */
    const reports = await prisma.report.findMany({
      select: {
        ...REPORT_SELECT,
        ticker: true,
        Stock: {
          select: {
            name: true,
            market: true,
            division: true,
            industry: true,
          },
        },
      },
      where: {
        ticker: {
          in: tickers,
        },
        is_newest: true,
        AND: REPORT_WHERE,
      },
      orderBy: {
        [Object.keys(REPORT_SELECT)[0]]: "desc",
      },
    });

    return NextResponse.json({
      keys: Object.keys(REPORT_SELECT),
      reports: parseBigintToNumber(reports),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new NextResponse(message, {
      status: 400,
    });
  }
}
