"use client";

import React from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import NextLink from "next/link";
import { Stock } from "@prisma/client";
import { Stack, Box, Grid, Typography, Link } from "@mui/material";
import {
  NotesOutlined,
  TimelineOutlined,
  ScheduleOutlined,
  ArticleOutlined,
} from "@mui/icons-material";
import { grey, blueGrey, blue } from "@mui/material/colors";
import { NAV_TITLES } from "@/lib/constants.ts";

export default function Nav(props: { stock: Stock }) {
  const { stock } = props;
  const segment = useSelectedLayoutSegment();
  const ITEMS = [
    {
      segment: "charts",
      link: `/stocks/${stock.ticker}/charts`,
      icon: <TimelineOutlined fontSize="small" />,
    },
    {
      segment: "indicators",
      link: `/stocks/${stock.ticker}/indicators`,
      icon: <NotesOutlined fontSize="small" />,
    },
    {
      segment: "performances",
      link: `/stocks/${stock.ticker}/performances`,
      icon: <ScheduleOutlined fontSize="small" />,
    },
    {
      segment: "documents",
      link: `/stocks/${stock.ticker}/documents/pl`,
      icon: <ArticleOutlined fontSize="small" />,
    },
  ];

  return (
    <Grid container borderRadius={1} spacing="1px" overflow="hidden">
      {ITEMS.map((item) => (
        <Grid key={item.segment} size={{ xs: 6, sm: 3, md: 3 }}>
          <Link href={item.link} underline="none" component={NextLink}>
            <Box
              color={item.segment === segment ? grey[50] : grey[600]}
              bgcolor={item.segment === segment ? blue[700] : blueGrey[50]}
              sx={{
                "&:hover": {
                  color: item.segment === segment ? grey[50] : grey[900],
                },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                height={44}
                spacing={1}
              >
                {item.icon}
                <Typography
                  variant="body2"
                  fontWeight={item.segment === segment ? "bold" : "normal"}
                  noWrap
                >
                  {NAV_TITLES[item.segment as keyof typeof NAV_TITLES]}
                </Typography>
              </Stack>
            </Box>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
