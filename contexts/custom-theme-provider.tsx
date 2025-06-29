"use client";

import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    large: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    large?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    large: true;
  }
}

let theme = createTheme();
theme = createTheme({
  typography: {
    large: {
      fontFamily: theme.typography.body1.fontFamily,
      fontWeight: theme.typography.body1.fontWeight,
      fontSize: "1.125rem",
      lineHeight: theme.typography.body1.lineHeight,
      letterSpacing: theme.typography.body1.letterSpacing,
    },
  },
});

export default function CustomThemeProvider(props: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
