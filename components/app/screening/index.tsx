"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import Search from "@/components/app/screening/search/index.tsx";
import ResultCondition from "@/components/app/screening/result/condition/index.tsx";
import ResultTable from "@/components/app/screening/result/table/index.tsx";
import {
  ListItems,
  SliderItems,
  INITIAL_STATES,
} from "@/components/app/screening/setting.ts";
import type { ReportWithStock, IndicatorKey } from "@/lib/types.ts";

export default function Screening() {
  const [listItems, setListItems] = useState<ListItems>({
    ...INITIAL_STATES.list,
  });
  const [sliderItems, setSliderItems] = useState<SliderItems>({
    ...INITIAL_STATES.slider,
  });
  const [keys, setKeys] = useState<IndicatorKey[]>([]);
  const [reports, setReports] = useState<ReportWithStock[]>([]);
  const [screen, setScreen] = useState<"search" | "result">("search");

  if (screen === "search") {
    return (
      <Search
        listItems={listItems}
        setListItems={setListItems}
        sliderItems={sliderItems}
        setSliderItems={setSliderItems}
        setKeys={setKeys}
        setReports={setReports}
        setScreen={setScreen}
      />
    );
  }

  if (screen === "result") {
    return (
      <>
        <Box mb={4}>
          <ResultCondition
            listItems={listItems}
            sliderItems={sliderItems}
            setScreen={setScreen}
          />
        </Box>
        <ResultTable keys={keys} reports={reports} />
      </>
    );
  }
}
