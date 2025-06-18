import { NextRequest, NextResponse } from "next/server";
import { PARAM_KEYS } from "@/lib/constants.ts";
import { suggestStocks } from "@/lib/functions.ts";

/*
  eslint-disable-next-line import/prefer-default-export --
  This is a specification of Next.js.
  */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get(PARAM_KEYS.search.query);
  const count = 10;

  try {
    if (query === null) {
      throw new Error("Bad Request");
    }

    const items = await suggestStocks(query, count);

    return NextResponse.json({
      items,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new NextResponse(message, {
      status: 400,
    });
  }
}
