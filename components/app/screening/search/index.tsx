"use client";

import React, { useState } from "react";
import { Stack, Button, Divider } from "@mui/material";
import { Search as SearchIcon, RestartAlt } from "@mui/icons-material";
import CustomSnackbar from "@/components/custom-snackbar/index.tsx";
import Overlay from "@/components/overlay/index.tsx";
import Section from "@/components/app/screening/search/section/index.tsx";
import ListItem from "@/components/app/screening/search/list-item/index.tsx";
import SliderItem from "@/components/app/screening/search/slider-item/index.tsx";
import {
  ListItemKey,
  ListItemValue,
  ListItems,
  SliderItemKey,
  SliderItemValue,
  SliderItems,
  INITIAL_STATES,
  SECTIONS,
} from "@/components/app/screening/setting.ts";
import {
  INDICATORS,
  PARAM_KEYS,
  PARAM_DELIMITER,
  Unit,
} from "@/lib/constants.ts";
import { indicatorToUnit } from "@/lib/functions.ts";
import type {
  ReportWithStock,
  IndicatorKey,
  SnackbarState,
} from "@/lib/types.ts";

const BUTTON_HEIGHT = 50;

export default function Search(props: {
  listItems: ListItems;
  setListItems: (listItems: ListItems) => void;
  sliderItems: SliderItems;
  setSliderItems: (sliderItems: SliderItems) => void;
  setKeys: (keys: IndicatorKey[]) => void;
  setReports: (reports: ReportWithStock[]) => void;
  setScreen: (screen: "search" | "result") => void;
}) {
  const {
    listItems,
    setListItems,
    sliderItems,
    setSliderItems,
    setKeys,
    setReports,
    setScreen,
  } = props;
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    severity: "info",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleClickSearchButton() {
    const activeDivisionIndexes = listItems.divisions
      .map((value, index) => (value.isActive ? index : null))
      .filter((value) => typeof value === "number");

    const activeIndustryIndexes = listItems.industries
      .map((value, index) => (value.isActive ? index : null))
      .filter((value) => typeof value === "number");

    const activeSliders = Object.entries(sliderItems).filter(
      ([, val]) => val.isActive,
    );

    if (activeDivisionIndexes.length === 0) {
      setSnackbarState({
        open: true,
        severity: "error",
        message: "1つ以上の市場を選択してください",
      });
    } else if (activeIndustryIndexes.length === 0) {
      setSnackbarState({
        open: true,
        severity: "error",
        message: "1つ以上の業種を選択してください",
      });
    } else if (activeSliders.length === 0) {
      setSnackbarState({
        open: true,
        severity: "error",
        message: "1つ以上の検索条件を指定してください",
      });
    } else {
      /**
       * params
       */
      const params = new URLSearchParams();
      const indicators: string[] = [];

      activeSliders.forEach(([key, item]) => {
        indicators.push(key);

        const { min, max } = item.value;
        const { limit } = item;
        const unit = indicatorToUnit(key as IndicatorKey);

        if (min > limit.min && min < limit.max) {
          let num = min;

          if (unit === Unit.Percentage) {
            num /= 100;
          } else if (unit === Unit.ThousandYen) {
            num *= 1000;
          } else if (unit === Unit.MillionYen) {
            num *= 1000000;
          }

          params.set(`min_${key}`, String(num));
        }

        if (max > limit.min && max < limit.max) {
          let num = max;

          if (unit === Unit.Percentage) {
            num /= 100;
          } else if (unit === Unit.ThousandYen) {
            num *= 1000;
          } else if (unit === Unit.MillionYen) {
            num *= 1000000;
          }

          params.set(`max_${key}`, String(num));
        }
      });

      params.set(
        PARAM_KEYS.screening.indicators,
        indicators.join(PARAM_DELIMITER),
      );

      params.set(
        PARAM_KEYS.screening.divisions,
        activeDivisionIndexes.join(PARAM_DELIMITER),
      );

      params.set(
        PARAM_KEYS.screening.industries,
        activeIndustryIndexes.join(PARAM_DELIMITER),
      );

      /**
       * request
       */
      setKeys([]);
      setReports([]);
      setIsLoading(true);
      const url = `/api/screening?${params.toString()}`;
      const res = await fetch(url);
      setIsLoading(false);

      /**
       * result
       */
      if (res.ok) {
        const json = await res.json();
        const tempKeys = json.keys as IndicatorKey[];
        const tempReports = json.reports as ReportWithStock[];

        if (tempKeys.length > 0 && tempReports.length > 0) {
          setKeys(tempKeys);
          setReports(tempReports);
          setScreen("result");
        } else {
          setSnackbarState({
            open: true,
            severity: "info",
            message: "検索条件にヒットする銘柄が存在しません",
          });
        }
      } else {
        const text = await res.text();
        setSnackbarState({
          open: true,
          severity: "error",
          message: text,
        });
      }
    }
  }

  function handleClickClearButton() {
    setListItems({ ...INITIAL_STATES.list });
    setSliderItems({ ...INITIAL_STATES.slider });
  }

  function handleChangeListItem(itemKey: ListItemKey, item: ListItemValue) {
    setListItems({
      ...listItems,
      [itemKey]: item,
    });
  }

  function handleChangeSliderItem(
    itemKey: SliderItemKey,
    item: SliderItemValue,
  ) {
    setSliderItems({
      ...sliderItems,
      [itemKey]: item,
    });
  }

  function handleCloseSnackbar() {
    setSnackbarState({
      ...snackbarState,
      open: false,
    });
  }

  return (
    <>
      <Stack pb={`${BUTTON_HEIGHT}px`} spacing={4} maxWidth="600px">
        <Section name="銘柄">
          <ListItem
            itemKey="divisions"
            item={listItems.divisions}
            label="市場"
            handleChange={handleChangeListItem}
          />
          <Divider />
          <ListItem
            itemKey="industries"
            item={listItems.industries}
            label="業種"
            handleChange={handleChangeListItem}
          />
        </Section>
        {SECTIONS.slider.map((section, sectionIndex) => (
          <Section key={sectionIndex} name={section.name}>
            {section.keys.map((itemKey, itemIndex, arr) => (
              <React.Fragment key={itemKey}>
                <SliderItem
                  itemKey={itemKey}
                  item={sliderItems[itemKey]}
                  label={INDICATORS[itemKey]}
                  handleChange={handleChangeSliderItem}
                />
                {itemIndex + 1 < arr.length && <Divider />}
              </React.Fragment>
            ))}
          </Section>
        ))}
      </Stack>
      <Overlay>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="contained"
            size="large"
            sx={{ height: BUTTON_HEIGHT }}
            disableElevation
            loading={isLoading}
            startIcon={<SearchIcon />}
            onClick={handleClickSearchButton}
          >
            検索
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ height: BUTTON_HEIGHT }}
            startIcon={<RestartAlt />}
            onClick={handleClickClearButton}
          >
            条件をクリア
          </Button>
        </Stack>
      </Overlay>
      <CustomSnackbar state={snackbarState} onClose={handleCloseSnackbar} />
    </>
  );
}
