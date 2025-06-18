"use client";

import React from "react";
import {
  Stack,
  Box,
  Slider,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  Button,
} from "@mui/material";
import { RestartAlt } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import SliderItemTextField from "@/components/app/screening/search/slider-item/slider-item-textfield/index.tsx";
import { indicatorToFractionDigits, indicatorToUnit } from "@/lib/functions.ts";
import type {
  SliderItemKey,
  SliderItemValue,
} from "@/components/app/screening/setting.ts";

export default function SliderItem(props: {
  itemKey: SliderItemKey;
  item: SliderItemValue;
  label: string;
  handleChange: (itemKey: SliderItemKey, item: SliderItemValue) => void;
}) {
  const { itemKey, item, label, handleChange } = props;
  const unit = indicatorToUnit(itemKey);
  const step = (1 / 10) ** indicatorToFractionDigits(itemKey);

  function handleChangeSectionHeader() {
    handleChange(itemKey, {
      ...item,
      isActive: !item.isActive,
    });
  }

  function handleChangeSlider(min: number, max: number) {
    handleChange(itemKey, {
      ...item,
      value: {
        min,
        max,
      },
    });
  }

  function handleChangeMinTextField(num: number) {
    let min = num;
    let { max } = item.value;

    if (min < item.limit.min) {
      min = item.limit.min;
    } else if (min > item.limit.max) {
      min = item.limit.max;
    }

    if (max < min) {
      max = min;
    }

    handleChange(itemKey, {
      ...item,
      value: {
        min,
        max,
      },
    });
  }

  function handleChangeMaxTextField(num: number) {
    let { min } = item.value;
    let max = num;

    if (max < item.limit.min) {
      max = item.limit.min;
    } else if (max > item.limit.max) {
      max = item.limit.max;
    }

    if (min > max) {
      min = max;
    }

    handleChange(itemKey, {
      ...item,
      value: {
        min,
        max,
      },
    });
  }

  function handleClickResetButton() {
    handleChange(itemKey, {
      ...item,
      value: {
        min: item.limit.min,
        max: item.limit.max,
      },
    });
  }

  return (
    <Stack px={2} py={1}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <FormGroup>
          <FormControlLabel
            label={label}
            control={
              <Checkbox
                checked={item.isActive}
                onChange={handleChangeSectionHeader}
              />
            }
          />
        </FormGroup>
        {item.isActive && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<RestartAlt />}
            onClick={handleClickResetButton}
            sx={{
              color: "#bbb",
              borderColor: "#bbb",
            }}
          >
            元に戻す
          </Button>
        )}
      </Stack>
      {item.isActive && (
        <Stack pt={2} pb={1} spacing={1}>
          <Stack
            color={grey[600]}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={0.3}>
              <Typography>{item.limit.min.toLocaleString()}</Typography>
              <Typography variant="body2">{unit}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.3}>
              <Typography>{item.limit.max.toLocaleString()}</Typography>
              <Typography variant="body2">{unit}</Typography>
            </Stack>
          </Stack>
          <Box px={1}>
            <Slider
              value={[item.value.min, item.value.max]}
              min={item.limit.min}
              max={item.limit.max}
              step={step}
              valueLabelDisplay="auto"
              onChange={(event: Event, value: number | number[]) => {
                if (Array.isArray(value)) {
                  handleChangeSlider(value[0], value[1]);
                }
              }}
              sx={{
                "& .MuiSlider-thumb": {
                  height: 30,
                  width: 30,
                  backgroundColor: "#fff",
                  border: "2px solid currentColor",
                },
              }}
            />
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <SliderItemTextField
              value={item.value.min}
              defaultValue={item.limit.min}
              limit={item.limit}
              unit={unit}
              step={step}
              label="最小値"
              onChange={handleChangeMinTextField}
            />
            <SliderItemTextField
              value={item.value.max}
              defaultValue={item.limit.max}
              limit={item.limit}
              unit={unit}
              step={step}
              label="最大値"
              onChange={handleChangeMaxTextField}
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
