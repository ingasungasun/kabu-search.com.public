import React, { Suspense } from "react";
import AdSenseIns from "@/components/adsense/adsense-ins/index.tsx";

export const SLOTS = {
  charts_1: "7472045902",
  charts_2: "3680974702",
  charts_9: "9088379903",
  ranking_1: "8272719500",
  ranking_9: "6690303501",
  stocks_charts_1: "9531483115",
  stocks_charts_9: "8834506788",
  stocks_documents_1: "9036126265",
  stocks_documents_9: "3205215086",
  stocks_indicators_1: "4715739317",
  stocks_indicators_9: "8284283388",
  stocks_performances_1: "1186751940",
  stocks_performances_9: "2089575974",
};

export default function DisplayAd(props: { unit: keyof typeof SLOTS }) {
  return (
    <Suspense fallback={<></>}>
      <AdSenseIns
        style={{
          display: "block",
          background:
            process.env.NODE_ENV === "development" ? "floralwhite" : "none",
        }}
        data-ad-client="ca-pub-5541345079732434"
        data-ad-slot={SLOTS[props.unit]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </Suspense>
  );
}
