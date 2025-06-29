import React from "react";
import { Stack, Typography, Select, MenuItem } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

const ICON_SPACING = 0.1;

export default function Pagination(props: {
  page: number;
  maxPage: number;
  handleChange: (value: number) => void;
}) {
  const { page, maxPage } = props;

  function hasPrev() {
    return page > 1;
  }

  function hasNext() {
    return page < maxPage;
  }

  function handleChange(event: SelectChangeEvent) {
    const value = Number(event.target.value);

    if (value !== page) {
      props.handleChange(value);
    }
  }

  function handleClickBefore() {
    if (hasPrev()) {
      props.handleChange(page - 1);
    }
  }

  function handleClickNext() {
    if (hasNext()) {
      props.handleChange(page + 1);
    }
  }

  return (
    <Stack direction="row" alignItems="center" spacing={3}>
      <Stack
        py={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={ICON_SPACING}
        onClick={handleClickBefore}
        sx={{
          opacity: hasPrev() ? 1 : 0.3,
          cursor: hasPrev() ? "pointer" : "not-allowed",
        }}
      >
        <NavigateBefore />
        <Typography>前へ</Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={0.7}
      >
        <Select value={String(page)} size="small" onChange={handleChange}>
          {[...Array(props.maxPage)].map((value, index) => (
            <MenuItem key={index} value={index + 1}>
              {index + 1}
            </MenuItem>
          ))}
        </Select>
        <Typography color={grey[500]}>/</Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={0.5}
        >
          <Typography>{props.maxPage.toLocaleString()}</Typography>
          <Typography variant="caption" color={grey[700]}>
            ページ
          </Typography>
        </Stack>
      </Stack>
      <Stack
        py={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={ICON_SPACING}
        onClick={handleClickNext}
        sx={{
          opacity: hasNext() ? 1 : 0.3,
          cursor: hasNext() ? "pointer" : "not-allowed",
        }}
      >
        <Typography>次へ</Typography>
        <NavigateNext />
      </Stack>
    </Stack>
  );
}
