import React from "react";
import { Container, Box, Grid } from "@mui/material";
import Logo from "@/components/header/logo/index.tsx";
import SearchBar from "@/components/header/search-bar/index.tsx";
import GlobalNav from "@/components/header/global-nav/index.tsx";
import { Z_INDEX } from "@/lib/constants.ts";

export default function Header() {
  return (
    <Box
      component="header"
      bgcolor="#fff"
      borderBottom="1px solid #eee"
      boxShadow="0 3px 3px -3px rgb(0, 0, 0, 0.05)"
      position="sticky"
      top={{ xs: "-40px", md: 0 }}
      left="0"
      zIndex={Z_INDEX.header}
    >
      <Container
        maxWidth={"lg"}
        sx={{
          mt: { xs: 1, md: 0 },
        }}
      >
        <Grid container rowSpacing={1} alignItems="center">
          <Grid
            size={{ xs: 12, md: 2 }}
            display={{ xs: "flex", md: "block" }}
            justifyContent="center"
          >
            <Logo />
          </Grid>
          <Grid
            container
            direction={{ xs: "column-reverse", md: "row" }}
            alignItems="center"
            rowSpacing={0}
            size={{ xs: 12, md: 10 }}
          >
            <Grid size={{ xs: 12, md: 8, lg: 7 }}>
              <GlobalNav />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 5 }}>
              <SearchBar />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
