"use client";

import React, { useState } from "react";
import {
  Stack,
  Modal,
  Checkbox,
  Button,
  Typography,
  FormControlLabel,
  Box,
  Grid,
} from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { Close } from "@mui/icons-material";
import type {
  ListItemKey,
  ListItemValue,
} from "@/components/app/screening/setting.ts";

const CHECKBOX_STYLE = {
  paddingRight: "3px",
};

export default function ListItem(props: {
  itemKey: ListItemKey;
  item: ListItemValue;
  label: string;
  handleChange: (itemKey: ListItemKey, item: ListItemValue) => void;
}) {
  const { itemKey, item, label, handleChange } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  function isEverythingChecked() {
    return item.filter((val) => !val.isActive).length === 0;
  }

  function isNothingChecked() {
    return item.filter((val) => val.isActive).length === 0;
  }

  function handleClickOpenButton() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleClickCloseIcon() {
    setIsModalOpen(false);
  }

  function handleChangeCheckAll() {
    if (isEverythingChecked()) {
      handleChange(
        itemKey,
        item.map((value) => ({
          name: value.name,
          isActive: false,
        })),
      );
    } else {
      handleChange(
        itemKey,
        item.map((value) => ({
          name: value.name,
          isActive: true,
        })),
      );
    }
  }

  function handleChangeCheckOne(index: number) {
    handleChange(itemKey, [
      ...item.slice(0, index),
      {
        name: item[index].name,
        isActive: !item[index].isActive,
      },
      ...item.slice(index + 1),
    ]);
  }

  function Names() {
    if (isEverythingChecked()) {
      return <Box>すべての{label}</Box>;
    }

    if (isNothingChecked()) {
      return <Box color={red[900]}>選択されていません</Box>;
    }

    return (
      <Grid container rowSpacing={0.3}>
        {item
          .filter((val) => val.isActive)
          .map((val, index, arr) => (
            <Grid
              key={index}
              sx={
                index + 1 < arr.length
                  ? {
                      "&::after": {
                        content: '"/"',
                        paddingLeft: "5px",
                        paddingRight: "5px",
                      },
                    }
                  : {}
              }
            >
              {val.name}
            </Grid>
          ))}
      </Grid>
    );
  }

  return (
    <>
      <Stack p={2} spacing={2}>
        <Box>
          <Button variant="outlined" onClick={handleClickOpenButton}>
            {label}を選択する
          </Button>
        </Box>
        <Stack direction="row" spacing={1}>
          <Typography
            minWidth={40}
            sx={{ "&::after": { content: '":"', paddingLeft: "3px" } }}
          >
            {label}
          </Typography>
          <Names />
        </Stack>
      </Stack>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            maxWidth: "90vw",
            maxHeight: "80vh",
            width: 600,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            overflowY: "scroll",
            scrollbarWidth: { xs: "inherit", md: "none" },
            msOverflowStyle: { xs: "inherit", md: "none" },
          }}
        >
          <Stack
            p={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              top: 0,
              position: "sticky",
              background: "white",
              boxShadow: 1,
              zIndex: 1,
            }}
          >
            <Typography variant="large" noWrap>
              {label}
            </Typography>
            <Close
              onClick={handleClickCloseIcon}
              sx={{ cursor: "pointer", color: grey[700] }}
            />
          </Stack>
          <Stack p={2}>
            <Box>
              <FormControlLabel
                label="すべて選択"
                control={
                  <Checkbox
                    checked={isEverythingChecked()}
                    size="small"
                    sx={CHECKBOX_STYLE}
                    onChange={handleChangeCheckAll}
                  />
                }
              />
            </Box>
            <Grid container>
              {item.map((value, index) => (
                <Grid key={index}>
                  <FormControlLabel
                    label={value.name}
                    control={
                      <Checkbox
                        checked={value.isActive}
                        size="small"
                        sx={CHECKBOX_STYLE}
                        onChange={() => handleChangeCheckOne(index)}
                      />
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
