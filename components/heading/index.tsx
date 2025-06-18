import React from "react";
import { Typography, TypographyTypeMap } from "@mui/material";

type Component = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

function defaultVariant(component: Component) {
  switch (component) {
    case "h1":
      return "h4";

    case "h2":
      return "h5";

    case "h3":
      return "h6";

    case "h4":
    case "h5":
    case "h6":
      return "large";

    default:
      return "body1";
  }
}

export default function Heading(props: {
  children: React.ReactNode;
  component: Component;
  variant?: TypographyTypeMap["props"]["variant"];
  color?: TypographyTypeMap["props"]["color"];
  fontWeight?: TypographyTypeMap["props"]["fontWeight"];
  textAlign?: TypographyTypeMap["props"]["textAlign"];
  noWrap?: TypographyTypeMap["props"]["noWrap"];
}) {
  const { children, component, variant, color, fontWeight, textAlign, noWrap } =
    props;

  return (
    <Typography
      component={component}
      variant={variant ?? defaultVariant(component)}
      color={color}
      fontWeight={fontWeight}
      textAlign={textAlign}
      noWrap={noWrap}
    >
      {children}
    </Typography>
  );
}
