import React from "react";
import { Box, Container } from "@mui/material";
import { Z_INDEX } from "@/lib/constants.ts";

export default function Overlay(props: {
  height?: number;
  children: React.ReactNode;
}) {
  return (
    <Box
      py={1}
      width="100vw"
      height={props.height}
      bgcolor="#fff"
      borderTop="1px solid #eee"
      boxShadow="0 -3px 3px -3px rgb(0, 0, 0, 0.1)"
      position="fixed"
      bottom="0"
      left="0"
      zIndex={Z_INDEX.overlay}
    >
      <Container maxWidth="lg">{props.children}</Container>
    </Box>
  );
}
