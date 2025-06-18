#!/usr/bin/env python

import concurrent.futures
import os
import traceback

import mysql.connector

from lib.constants import MYSQL_CONFIG, STORAGE_DIR
from lib.functions import create_logger

logger = create_logger(__name__)

MAX_WORKERS = 10000
CHECK_DIGIT = {
    # -------------------------------
    # 連結
    # 数値の合計が 111 であれば正常
    # -------------------------------
    # 連結貸借対照表
    "ConsolidatedBalanceSheetTextBlock": 1,
    "ConsolidatedBalanceSheetUSGAAPTextBlock": 1,
    "ConsolidatedStatementOfFinancialPositionIFRSTextBlock": 1,
    # 連結損益計算書
    "ConsolidatedStatementOfIncomeTextBlock": 10,
    "ConsolidatedStatementOfIncomeUSGAAPTextBlock": 10,
    "ConsolidatedStatementOfProfitOrLossIFRSTextBlock": 10,
    # 連結損益及び包括利益計算書
    "ConsolidatedStatementOfComprehensiveIncomeSingleStatementTextBlock": 10,
    "ConsolidatedStatementOfComprehensiveIncomeSingleStatementUSGAAPTextBlock": 10,
    "ConsolidatedStatementOfComprehensiveIncomeSingleStatementIFRSTextBlock": 10,
    "ConsolidatedStatementOfIncomeIFRSTextBlock": 10,
    # 連結キャッシュ・フロー計算書
    "ConsolidatedStatementOfCashFlowsTextBlock": 100,
    "ConsolidatedStatementOfCashFlowsUSGAAPTextBlock": 100,
    "ConsolidatedStatementOfCashFlowsIFRSTextBlock": 100,
    # -------------------------------
    # 単独
    # 数値の合計が 111000 であれば正常
    # -------------------------------
    # 貸借対照表
    "BalanceSheetTextBlock": 1000,
    "StatementOfFinancialPositionIFRSTextBlock": 1000,
    # 損益計算書
    "StatementOfIncomeTextBlock": 10000,
    "StatementOfProfitOrLossIFRSTextBlock": 10000,
    # キャッシュ・フロー計算書
    "StatementOfCashFlowsTextBlock": 100000,
    "StatementOfCashFlowsIFRSTextBlock": 100000,
}


def validate(record: tuple):
    doc_id = record[0]
    ticker = record[1]
    is_consolidated = record[2]

    doc_dir = f"{STORAGE_DIR}/documents/{ticker[0:2]}/{ticker}/{doc_id}"
    total = 0

    for file_name in os.listdir(doc_dir):
        if file_name in CHECK_DIGIT:
            total += CHECK_DIGIT[file_name]
        else:
            message = "Unknown file name\n"
            message += f"ticker: {ticker}\n"
            message += f"doc_id: {doc_id}\n"
            message += f"file_name: {file_name}"
            logger.info(message)

    if is_consolidated == 1:
        return total == 111
    else:
        return total == 111000


"""
ストレージに保存した決算書から不備があるものを探してログに残す
"""
try:
    incomplete_reports = []

    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                doc_id,
                ticker,
                is_consolidated
            FROM reports
            """
        )
        records = cursor.fetchall()

    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_record = {
            executor.submit(validate, record): record for record in records
        }

    for future in concurrent.futures.as_completed(future_to_record):
        record = future_to_record[future]

        if not future.result():
            incomplete_reports.append(record)

    if len(incomplete_reports) > 0:
        message = "These documents are incomplete."

        for missing_report in incomplete_reports:
            doc_id = missing_report[0]
            ticker = missing_report[1]
            message += f"\n{ticker},{doc_id}"

        logger.info(message)

except Exception:
    traceback.print_exc()
