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
    const stock = await prisma.stock.findUnique({
      where: {
        ticker,
      },
    });

    return NextResponse.json({
      stock: parseBigintToNumber(stock),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new NextResponse(message, {
      status: 400,
    });
  }
}
