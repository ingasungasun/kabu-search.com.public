"use client";

import React from "react";
import {
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  Typography,
  Stack,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { CHARACTER_LIMITS } from "@/lib/constants.ts";
import useSearch from "@/hooks/use-search.ts";

export default function SearchBar() {
  const {
    formElement,
    inputElement,
    text,
    items,
    index,
    isActive,
    handleFocus,
    handleInput,
    handleSubmit,
    handleClickSearchIcon,
    handleClickItem,
    handleMouseOverItem,
  } = useSearch();

  return (
    <form
      ref={formElement}
      onSubmit={handleSubmit}
      style={{
        position: "relative",
      }}
    >
      <TextField
        inputRef={inputElement}
        fullWidth
        size="small"
        variant="outlined"
        value={text}
        placeholder="銘柄名 or 証券コード"
        tabIndex={0}
        onInput={handleInput}
        onFocus={handleFocus}
        slotProps={{
          htmlInput: {
            maxLength: CHARACTER_LIMITS.searchQuery.max,
          },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon
                  aria-hidden={false}
                  tabIndex={0}
                  onClick={handleClickSearchIcon}
                  sx={{
                    cursor: "default",
                  }}
                />
              </InputAdornment>
            ),
          },
        }}
      />
      {isActive && items.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            position: "absolute",
          }}
        >
          <List>
            {items.map((item, tempIndex) => (
              <ListItem
                key={item.ticker}
                disablePadding
                onClick={() => handleClickItem(item)}
                onMouseOver={() => handleMouseOverItem(tempIndex)}
                sx={{
                  padding: "10px",
                  cursor: "default",
                  background: tempIndex === index ? grey[200] : "white",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                >
                  <Typography
                    variant="body2"
                    sx={{
                      "&::after": {
                        content: '":"',
                      },
                    }}
                  >
                    {item.ticker}
                  </Typography>
                  <Typography variant="body1" noWrap>
                    {item.name}
                  </Typography>
                </Stack>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </form>
  );
}
