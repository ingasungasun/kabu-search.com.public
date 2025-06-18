#!/usr/bin/env python

import re
import traceback

import edinet
import mysql.connector
import pandas as pd

from lib.constants import MYSQL_CONFIG
from lib.functions import create_logger

logger = create_logger(__name__)

CODE_LIST_PARAMS = {
    "skiprows": 1,
    "na_filter": False,
    "dtype": "string",
    "encoding": "shift_jisx0213",
}
NOT_FOUND_RECORDS = []
ABBREVIATION_FOR_KK = "（株）"
values = []

try:
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute("SELECT * FROM stocks WHERE name NOT IN ('日本銀行')")
        records = cursor.fetchall()

    EDINET_CODE_DF = pd.read_csv(edinet.EDINET_CODE_LIST_URL, **CODE_LIST_PARAMS)
    FUND_CODE_DF = pd.read_csv(edinet.FUND_CODE_LIST_URL, **CODE_LIST_PARAMS)

    for record in records:
        edinet_code = record[1]
        fund_code = record[2]
        ticker = record[3]
        market = record[4]
        division = record[5]
        name = record[6]
        full_name = record[7]
        english_name = record[8]
        kana_name = record[9]
        address = record[10]
        industry = record[11]
        scale = record[12]
        closing_date = record[13]
        is_foreign = record[14]
        sec_code = ticker + "0"

        if division == "REIT":
            item_df = FUND_CODE_DF[FUND_CODE_DF["証券コード"] == sec_code]

            if item_df.empty:
                NOT_FOUND_RECORDS.append(record)
                continue

            item_sr = item_df.iloc[0]
            dates = []

            if item_sr["特定期1"] != "":
                dates.append(item_sr["特定期1"])

            if item_sr["特定期2"] != "":
                dates.append(item_sr["特定期2"])

            closing_date = ",".join(dates)
            edinet_code = item_sr["ＥＤＩＮＥＴコード"]
            fund_code = item_sr["ファンドコード"]
            full_name = item_sr["ファンド名"]
            kana_name = item_sr["ファンド名（ヨミ）"]

        else:
            item_df = EDINET_CODE_DF[EDINET_CODE_DF["証券コード"] == sec_code]

            if item_df.empty:
                NOT_FOUND_RECORDS.append(record)
                continue

            item_sr = item_df.iloc[0]

            if division == "出資証券" or is_foreign == 1:
                full_name = name
            else:
                if re.search(r"^(株式会社|㈱|\(株\)|（株）)", item_sr["提出者名"]):
                    full_name = ABBREVIATION_FOR_KK + name
                else:
                    full_name = name + ABBREVIATION_FOR_KK

            edinet_code = item_sr["ＥＤＩＮＥＴコード"]
            english_name = item_sr["提出者名（英字）"]
            kana_name = re.sub(
                r"(^カブ.+?シ(ャ|ヤ)\s*|\s*カブ.+?シ(ャ|ヤ)$)",
                "",
                item_sr["提出者名（ヨミ）"],
            )
            address = item_sr["所在地"]
            industry = (
                item_sr["提出者業種"]
                if not re.search(r"外国法人", item_sr["提出者業種"])
                else ""
            )
            closing_date = item_sr["決算日"]

        values.append(
            (
                edinet_code,
                fund_code,
                ticker,
                market,
                division,
                name,
                full_name,
                english_name,
                kana_name,
                address,
                industry,
                scale,
                closing_date,
                is_foreign,
            )
        )

    if len(NOT_FOUND_RECORDS) > 0:
        message = (
            "These stocks are not listed in the EDINET code list or the fund code list."  # noqa: E501
        )

        for record in NOT_FOUND_RECORDS:
            message += f"\n{record[4]}, {record[3]}, {record[6]}"

        logger.info(message)

    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.executemany(
            """
            INSERT INTO stocks
                (
                    edinet_code,
                    fund_code,
                    ticker,
                    market,
                    division,
                    name,
                    full_name,
                    english_name,
                    kana_name,
                    address,
                    industry,
                    scale,
                    closing_date,
                    is_foreign
                )
            VALUES
                (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                edinet_code=VALUES(edinet_code),
                fund_code=VALUES(fund_code),
                full_name=VALUES(full_name),
                english_name=VALUES(english_name),
                kana_name=VALUES(kana_name),
                address=VALUES(address),
                industry=VALUES(industry),
                closing_date=VALUES(closing_date)
            """,
            values,
        )
        cnx.commit()

except mysql.connector.Error:
    logger.error(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
