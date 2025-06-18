"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Stack, CircularProgress } from "@mui/material";
import CustomSelect from "@/components/custom-select/index.tsx";
import { STATEMENTS } from "@/lib/constants.ts";

const MILLISECONDS_TO_WAIT_LOADING = 500;

export default function Select(props: {
  ticker: string;
  statement: string;
  date: string;
  dates: string[];
}) {
  const { ticker, statement, date, dates } = props;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function reload(tempStatement: string, tempDate: string) {
    let url = `/stocks/${ticker}/documents/${tempStatement}`;

    if (tempDate !== dates[0]) {
      url += `?period_end=${tempDate}`;
    }

    setIsLoading(true);
    setTimeout(() => {
      router.push(url, { scroll: false });
    }, MILLISECONDS_TO_WAIT_LOADING);
  }

  function handleChangeStatement(value: string) {
    reload(value, date);
  }

  function handleChangePeriodEnd(value: string) {
    reload(statement, value);
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
        <>
          <CustomSelect
            label="決算書"
            selected={statement}
            values={Object.keys(STATEMENTS)}
            formatter={(value) =>
              `${value.at(0)?.toUpperCase()}/${value.at(1)?.toUpperCase()}`
            }
            handleChange={handleChangeStatement}
          />
          <CustomSelect
            label="会計年度"
            selected={date}
            values={dates}
            formatter={(value) => dayjs(value).format("YYYY年MM月")}
            handleChange={handleChangePeriodEnd}
          />
        </>
      ) : (
        <CircularProgress />
      )}
    </Stack>
  );
}
