import React from "react";
import { Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Stock } from "@prisma/client";

const SPACING = 1;
const SX = { "&::before": { paddingRight: SPACING, content: "'/'" } };

export default function Details(props: { stock: Stock }) {
  const { stock } = props;

  return (
    <Stack direction="row" spacing={SPACING}>
      <Typography variant="body2" component="h2" color={grey[600]}>
        {stock.ticker}
      </Typography>
      <Typography variant="body2" component="div" color={grey[600]} sx={SX}>
        {stock.market === "東証" ? stock.market + stock.division : stock.market}
      </Typography>
      {stock.industry !== "" && (
        <Typography variant="body2" component="div" color={grey[600]} sx={SX}>
          {stock.industry}
        </Typography>
      )}
    </Stack>
  );
}
