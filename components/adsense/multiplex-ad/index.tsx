import React, { Suspense } from "react";
import AdSenseIns from "@/components/adsense/adsense-ins/index.tsx";

export const SLOTS = {
  multiplex_stocks_charts: "8108582622",
};

export default function MultiplexAd(props: { unit: keyof typeof SLOTS }) {
  return (
    <Suspense fallback={<></>}>
      <AdSenseIns
        style={{
          display: "block",
          background:
            process.env.NODE_ENV === "development" ? "floralwhite" : "none",
        }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-5541345079732434"
        data-ad-slot={SLOTS[props.unit]}
      />
    </Suspense>
  );
}
