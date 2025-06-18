"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Stack, CircularProgress } from "@mui/material";
import CustomSelect from "@/components/custom-select/index.tsx";

const MILLISECONDS_TO_WAIT_LOADING = 500;

export default function Select(props: {
  ticker: string;
  date: string;
  dates: string[];
}) {
  const { ticker, date, dates } = props;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function handleChangePeriodEnd(value: string) {
    let url = `/stocks/${ticker}/indicators`;

    if (value !== dates[0]) {
      url += `?period_end=${value}`;
    }

    setIsLoading(true);
    setTimeout(() => {
      router.push(url, { scroll: false });
    }, MILLISECONDS_TO_WAIT_LOADING);
  }

  useEffect(() => {
    setIsLoading(false);
  }, [props]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={1}
      height={55}
    >
      {!isLoading ? (
        <CustomSelect
          label="会計年度"
          selected={date}
          values={dates}
          formatter={(value) => dayjs(value).format("YYYY年MM月")}
          handleChange={handleChangePeriodEnd}
        />
      ) : (
        <CircularProgress />
      )}
    </Stack>
  );
}
