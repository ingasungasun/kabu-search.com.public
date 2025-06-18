import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma-client.ts";
import { PARAM_KEYS, INDUSTRIES, SORTS_IN_RANKING } from "@/lib/constants.ts";
import { parseBigintToNumber } from "@/lib/functions.ts";

/*
  eslint-disable-next-line import/prefer-default-export --
  This is a specification of Next.js.
  */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const market = searchParams.get(PARAM_KEYS.ranking.market);
  const industry = searchParams.get(PARAM_KEYS.ranking.industry);
  const sort = searchParams.get(PARAM_KEYS.ranking.sort) ?? SORTS_IN_RANKING[0];

  const STOCK_WHERE: Prisma.StockWhereInput[] = [];

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

    const stocks = await prisma.stock.findMany({
      select: {
        ticker: true,
      },
      where: {
        AND: STOCK_WHERE,
      },
    });

    const tickers = stocks.map((stock) => stock.ticker);

    const reports = await prisma.report.findMany({
      select: {
        id: true,
        [sort]: true,
        Stock: {
          select: {
            ticker: true,
            market: true,
            division: true,
            name: true,
            industry: true,
          },
        },
      },
      where: {
        ticker: {
          in: tickers,
        },
        is_newest: true,
        [sort]: {
          not: null,
        },
      },
      orderBy: [
        {
          [sort]: "desc",
        },
        {
          Stock: {
            ticker: "asc",
          },
        },
      ],
    });

    return NextResponse.json({
      reports: parseBigintToNumber(reports),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new NextResponse(message, {
      status: 400,
    });
  }
}
