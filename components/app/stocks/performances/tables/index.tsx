import React from "react";
import { Stock, Report } from "@prisma/client";
import { Box, Stack } from "@mui/material";
import Table from "@/components/app/stocks/performances/table/index.tsx";
import DisplayAd from "@/components/adsense/display-ad/index.tsx";
import { STATEMENTS } from "@/lib/constants.ts";

const TABLES: {
  statement: keyof typeof STATEMENTS;
  keys: (keyof Report)[];
}[] = [
  {
    statement: "pl",
    keys: [
      "net_sales",
      "cost_of_sales",
      "gross_profit",
      "sga",
      "operating_income",
      "non_operating_income",
      "non_operating_expenses",
      "ordinary_income",
      "extraordinary_income",
      "extraordinary_loss",
      "actual_profit_loss",
    ],
  },
  {
    statement: "bs",
    keys: [
      // 資産
      "assets",
      "current_assets",
      "cash_and_deposits",
      "notes_and_accounts_receivable",
      "inventories",
      "non_current_assets",
      // 負債
      "liabilities",
      "current_liabilities",
      "notes_and_accounts_payable",
      "non_current_liabilities",
      // 純資産
      "net_assets",
      "retained_earnings",
      "treasury_shares",
    ],
  },
  {
    statement: "cf",
    keys: [
      "operating_cash_flow",
      "investing_cash_flow",
      "financing_cash_flow",
      "free_cash_flow",
    ],
  },
];

export default function Tables(props: { stock: Stock; reports: Report[] }) {
  const { stock, reports } = props;

  return (
    <Stack spacing={{ xs: 4, sm: 5, md: 6 }}>
      {TABLES.map((table, index) => (
        <React.Fragment key={index}>
          <Box>
            <Table
              stock={stock}
              statement={table.statement}
              keys={table.keys}
              reports={reports}
            />
          </Box>
          {index === 0 && (
            <Box>
              <DisplayAd unit="stocks_performances_1" />
            </Box>
          )}
          {index === 1 && (
            <Box>
              <DisplayAd unit="stocks_performances_9" />
            </Box>
          )}
        </React.Fragment>
      ))}
    </Stack>
  );
}
