"use client";

import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSenseIns(props: {
  style: React.CSSProperties;
  "data-ad-client": string;
  "data-ad-slot": string;
  "data-ad-format": string;
  "data-full-width-responsive"?: string;
  "data-ad-layout"?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = `${pathname}?${searchParams}`;

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn(error);
    }
  }, [url]);

  return <ins key={url} className="adsbygoogle" {...props}></ins>;
}
