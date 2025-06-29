#!/usr/bin/env python

import re
import zipfile

import bs4
import htmlmin

TEXT_BLOCKS_FOR_CONSOLIDATED = [
    # 連結貸借対照表
    "ConsolidatedBalanceSheetTextBlock",
    "ConsolidatedBalanceSheetUSGAAPTextBlock",
    "ConsolidatedStatementOfFinancialPositionIFRSTextBlock",
    # 連結損益計算書
    "ConsolidatedStatementOfIncomeTextBlock",
    "ConsolidatedStatementOfIncomeUSGAAPTextBlock",
    "ConsolidatedStatementOfProfitOrLossIFRSTextBlock",
    # 連結損益及び包括利益計算書
    "ConsolidatedStatementOfComprehensiveIncomeSingleStatementTextBlock",
    "ConsolidatedStatementOfComprehensiveIncomeSingleStatementUSGAAPTextBlock",
    "ConsolidatedStatementOfComprehensiveIncomeSingleStatementIFRSTextBlock",
    "ConsolidatedStatementOfIncomeIFRSTextBlock",
    # 連結キャッシュ・フロー計算書
    "ConsolidatedStatementOfCashFlowsTextBlock",
    "ConsolidatedStatementOfCashFlowsUSGAAPTextBlock",
    "ConsolidatedStatementOfCashFlowsIFRSTextBlock",
]

TEXT_BLOCKS_FOR_NON_CONSOLIDATED = [
    # 貸借対照表
    "BalanceSheetTextBlock",
    "StatementOfFinancialPositionIFRSTextBlock",
    # 損益計算書
    "StatementOfIncomeTextBlock",
    "StatementOfProfitOrLossIFRSTextBlock",
    # キャッシュ・フロー計算書
    "StatementOfCashFlowsTextBlock",
    "StatementOfCashFlowsIFRSTextBlock",
]

REGEX_FOR_CONSOLIDATED = re.compile(
    rf"^(\w+:)?({'|'.join(TEXT_BLOCKS_FOR_CONSOLIDATED)})$"
)

REGEX_FOR_NON_CONSOLIDATED = re.compile(
    rf"^(\w+:)?({'|'.join(TEXT_BLOCKS_FOR_NON_CONSOLIDATED)})$"
)


def analyze(ixbrl_file: zipfile.ZipExtFile, is_consolidated: bool):
    soup = bs4.BeautifulSoup(ixbrl_file.read(), "html.parser", from_encoding="utf-8")
    statements: list[dict[str, str]] = []

    for tag in soup.find_all(
        "ix:nonnumeric",
        attrs={
            "name": REGEX_FOR_CONSOLIDATED
            if is_consolidated
            else REGEX_FOR_NON_CONSOLIDATED
        },
    ):
        statements.append(
            {
                "name": re.sub(r"^\w+:", "", tag["name"]),
                "html": htmlmin.minify(str(tag)),
            }
        )

    return statements
