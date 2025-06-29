import { NextRequest, NextResponse, userAgent } from "next/server";

/*
  eslint-disable-next-line import/prefer-default-export --
  This is a specification of Next.js.
  */
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { device } = userAgent(request);
  url.searchParams.set("device_type", device.type ?? "desktop");
  return NextResponse.rewrite(url);
}
