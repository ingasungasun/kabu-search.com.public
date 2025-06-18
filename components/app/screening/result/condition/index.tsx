"use client";

import React from "react";
import { Box, Stack, Typography, Grid, Button } from "@mui/material";
import {
  ListItemValue,
  ListItems,
  SliderItemKey,
  SliderItemValue,
  SliderItems,
} from "@/components/app/screening/setting.ts";
import { INDICATORS } from "@/lib/constants.ts";
import { indicatorToUnit } from "@/lib/functions.ts";

function ListItemCondition(props: { label: string; items: ListItemValue }) {
  const { label, items } = props;

  return (
    <Stack direction="row" spacing={1}>
      <Typography
        minWidth={36}
        variant="body2"
        sx={{ "&::after": { content: '":"', paddingLeft: "3px" } }}
      >
        {label}
      </Typography>
      {items.filter((item) => !item.isActive).length === 0 ? (
        <Typography variant="body2">すべての{label}</Typography>
      ) : (
        <Grid container rowSpacing={0.3}>
          {items
            .filter((item) => item.isActive)
            .map((item, index, arr) => (
              <Grid key={index}>
                <Typography
                  variant="body2"
                  sx={
                    index + 1 < arr.length
                      ? {
                          "&::after": {
                            content: '"/"',
                            paddingLeft: "4px",
                            paddingRight: "4px",
                          },
                        }
                      : {}
                  }
                >
                  {item.name}
                </Typography>
              </Grid>
            ))}
        </Grid>
      )}
    </Stack>
  );
}

function SliderItemCondition(props: {
  itemKey: SliderItemKey;
  item: SliderItemValue;
}) {
  const { itemKey, item } = props;

  return (
    <Stack direction="row" spacing={1}>
      <Typography
        minWidth={36}
        variant="body2"
        sx={{ "&::after": { content: '":"', paddingLeft: "3px" } }}
      >
        {INDICATORS[itemKey]}
      </Typography>
      <Stack direction="row" spacing={1}>
        {item.value.min === item.limit.min ? (
          <Typography variant="body2">指定なし</Typography>
        ) : (
          <Typography variant="body2">
            {`${item.value.min.toLocaleString()} ${indicatorToUnit(itemKey)}`}
          </Typography>
        )}
        <Typography variant="body2">～</Typography>
        {item.value.max === item.limit.max ? (
          <Typography variant="body2">指定なし</Typography>
        ) : (
          <Typography variant="body2">
            {`${item.value.max.toLocaleString()} ${indicatorToUnit(itemKey)}`}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

export default function ResultCondition(props: {
  listItems: ListItems;
  sliderItems: SliderItems;
  setScreen: (screen: "search" | "result") => void;
}) {
  const { listItems, sliderItems, setScreen } = props;

  function handleClickButton() {
    setScreen("search");
  }

  return (
    <>
      <Box mb={1}>
        <Typography variant="h6" fontWeight="bold">
          検索条件
        </Typography>
      </Box>
      <Stack mb={2} spacing={0.5}>
        <ListItemCondition label="市場" items={listItems.divisions} />
        <ListItemCondition label="業種" items={listItems.industries} />
        {Object.entries(sliderItems)
          .filter(([, item]) => item.isActive)
          .map(([itemKey, item]) => (
            <SliderItemCondition
              key={itemKey}
              itemKey={itemKey as SliderItemKey}
              item={item}
            />
          ))}
      </Stack>
      <Box>
        <Button variant="outlined" size="large" onClick={handleClickButton}>
          条件を変更する
        </Button>
      </Box>
    </>
  );
}
