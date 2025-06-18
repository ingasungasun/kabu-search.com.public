import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import { Report } from "@prisma/client";
import { prisma } from "@/lib/prisma-client.ts";
import { parseBigintToNumber } from "@/lib/functions.ts";

type Params = Promise<{
  ticker: string;
  period_end: string;
}>;

/*
  eslint-disable-next-line import/prefer-default-export --
  This is a specification of Next.js.
  */
export async function GET(
  request: NextRequest,
  segmentData: { params: Params },
) {
  const params = await segmentData.params;
  const { ticker } = params;
  const periodEnd = params.period_end;
  let report: Report | null;

  try {
    if (periodEnd === "newest") {
      report = await prisma.report.findFirst({
        where: {
          ticker,
        },
        orderBy: {
          period_end: "desc",
        },
      });
    } else if (periodEnd === "oldest") {
      report = await prisma.report.findFirst({
        where: {
          ticker,
        },
        orderBy: {
          period_end: "asc",
        },
      });
    } else if (dayjs(periodEnd).isValid()) {
      report = await prisma.report.findFirst({
        where: {
          ticker,
          period_end: new Date(periodEnd),
        },
      });
    } else {
      throw new Error("Bad Request");
    }

    return NextResponse.json({
      report: parseBigintToNumber(report),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new NextResponse(message, {
      status: 400,
    });
  }
}
