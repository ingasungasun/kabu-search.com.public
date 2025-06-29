"use client";

import React from "react";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

export default function CustomSelect(props: {
  label: string;
  selected?: string;
  values: string[];
  size?: "small" | "medium";
  disabled?: boolean;
  formatter?: (value: string) => string;
  handleChange: (value: string) => void;
}) {
  const { label, selected, values, size, disabled, formatter } = props;

  function handleChange(event: SelectChangeEvent) {
    props.handleChange(event.target.value);
  }

  return (
    <FormControl disabled={disabled} sx={{ opacity: disabled ? "0.5" : "1" }}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={selected}
        onChange={handleChange}
        size={size ?? "medium"}
      >
        {values.map((value, index) => (
          <MenuItem key={index} value={value}>
            {formatter ? formatter(value) : value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
