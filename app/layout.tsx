import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { CssBaseline, Container } from "@mui/material";
import Header from "@/components/header/index.tsx";
import CustomThemeProvider from "@/contexts/custom-theme-provider.tsx";
import { TITLES } from "@/lib/constants.ts";

import "@/styles/reset.scss";
import "@fontsource-variable/m-plus-1";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export const metadata: Metadata = {
  title: TITLES.index,
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <CustomThemeProvider>
          <CssBaseline />
          <Header />
          <Container
            component="main"
            maxWidth="lg"
            sx={{
              pt: { xs: 3, sm: 3, md: 4 },
              pb: { xs: 4, sm: 4, md: 6 },
            }}
          >
            {props.children}
          </Container>
        </CustomThemeProvider>
      </body>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5541345079732434"
        crossOrigin="anonymous"
      />
      {process.env.NODE_ENV === "production" && (
        <>
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-36S3SJNTNL"
          />
          <Script src="/google-analytics.js" />
          <Script src="/clarity.js" />
        </>
      )}
    </html>
  );
}
