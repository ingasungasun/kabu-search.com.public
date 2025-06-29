"use client";

import React, { useState, useEffect } from "react";
import { Stack, Typography, TextField } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Range } from "@/lib/types.ts";

export default function SliderItemTextField(props: {
  value: number;
  defaultValue: number;
  limit: Range;
  unit: string;
  step: number;
  label: string;
  onChange: (num: number) => void;
}) {
  const { value, defaultValue, limit, unit, step, label, onChange } = props;
  const [text, setText] = useState(String(value));
  const [isActive, setIsActive] = useState(false);

  function changeValue() {
    if (text === "") {
      onChange(defaultValue);
      setText(String(defaultValue));
    } else {
      let num = Number(text);

      if (num < limit.min) {
        num = limit.min;
      } else if (num > limit.max) {
        num = limit.max;
      }

      onChange(num);
      setText(String(num));
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;

    if (newValue === "") {
      setText(newValue);
    } else if (step === 0.1 && newValue.match(/^\d+(\.\d?)?$/)) {
      setText(newValue.replace(/^0+(\d)$/, "$1"));
    } else if (step === 1 && newValue.match(/^\d+$/)) {
      setText(newValue.replace(/^0+(\d)$/, "$1"));
    }
  }

  function handleFocus() {
    setIsActive(true);
  }

  function handleBlur() {
    setIsActive(false);
    changeValue();
  }

  function handleKeyUp(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      changeValue();
      event.stopPropagation();
    }
  }

  useEffect(() => {
    setText(String(value));
  }, [value]);

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <TextField
        value={value !== defaultValue || isActive ? text : ""}
        placeholder="指定なし"
        label={label}
        sx={{ width: "100%", maxWidth: "100px" }}
        slotProps={{ inputLabel: { shrink: true } }}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyUp={handleKeyUp}
      />
      <Typography variant="body2" color={grey[600]}>
        {unit}
      </Typography>
    </Stack>
  );
}
