import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client.ts";
import { parseBigintToNumber } from "@/lib/functions.ts";

type Params = Promise<{
  ticker: string;
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

  try {
    const reports = await prisma.report.findMany({
      where: {
        ticker,
      },
      orderBy: {
        period_end: "asc",
      },
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
