"use client";

import React, { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Box, Stack, Typography, Link } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { TITLES } from "@/lib/constants.ts";
import styles from "./styles.module.scss";

const ITEMS = [
  {
    link: "/charts",
    text: TITLES.charts,
  },
  {
    link: "/ranking",
    text: TITLES.ranking,
  },
  {
    link: "/screening",
    text: TITLES.screening,
  },
  {
    link: "/contact",
    text: TITLES.contact,
  },
];

export default function GlobalNav() {
  const pathname = usePathname();
  const sentinel = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      setIsVisible(!entries[0].isIntersecting);
    });

    if (sentinel.current) {
      observer.observe(sentinel.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <nav className={styles.root}>
      <NavigateNext
        className={`${styles.navigate} ${isVisible ? styles.visible : ""}`}
        sx={{ color: grey[600], display: { xs: "inherit", md: "none" } }}
      />
      <Stack className={styles.scroller} direction="row" spacing={2}>
        {ITEMS.map((item, index) => (
          <Box
            key={item.link}
            ref={index === ITEMS.length - 1 ? sentinel : null}
            borderBottom={2}
            borderColor={item.link === pathname ? "#222" : " #fff"}
          >
            <Link href={item.link} underline="none" component={NextLink}>
              <Stack px={1} justifyContent="center" height={{ xs: 50, md: 54 }}>
                <Typography variant="body2" color={grey[900]} noWrap>
                  {item.text}
                </Typography>
              </Stack>
            </Link>
          </Box>
        ))}
      </Stack>
    </nav>
  );
}
