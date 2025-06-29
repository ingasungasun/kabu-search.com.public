import React from "react";
import { Stack, Box } from "@mui/material";
import DisplayAd from "@/components/adsense/display-ad/index.tsx";

export default function XBRL(props: { html: string }) {
  const { html } = props;

  return (
    <>
      <Stack
        mb={4}
        alignItems="center"
        sx={{
          "& table": {
            maxWidth: "700px !important",
            width: "100vw !important",
            "& tr": {
              "& td": {
                marginTop: "0 !important",
                marginBottom: "0 !important",
                paddingTop: {
                  xs: "6px !important",
                  sm: "8px !important",
                  md: "10px !important",
                },
                paddingBottom: {
                  xs: "6px !important",
                  sm: "8px !important",
                  md: "10px !important",
                },
                "& *": {
                  marginTop: "0 !important",
                  marginBottom: "0 !important",
                  paddingTop: "0 !important",
                  paddingBottom: "0 !important",
                  fontSize: {
                    xs: "13px !important",
                    sm: "14px !important",
                    md: "15px !important",
                  },
                  fontFamily: "'Roboto', sans-serif !important",
                },
              },
            },
          },
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Stack>
      <Box>
        <DisplayAd unit="stocks_documents_9" />
      </Box>
    </>
  );
}
