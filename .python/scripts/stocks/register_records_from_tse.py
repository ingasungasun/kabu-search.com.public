#!/usr/bin/env python

import re
import traceback

import mysql.connector
import pandas as pd

from lib.constants import TSE_EQUITY_LIST_URL
from lib.functions import create_logger, insert_into_stocks_table

logger = create_logger(__name__)
values = []

try:
    data = pd.read_excel(TSE_EQUITY_LIST_URL, na_filter=False, dtype="string")

    for row in data.iterrows():
        item = row[1]

        ticker = item["コード"]
        name = item["銘柄名"]
        scale = item["規模区分"] if len(item["規模区分"]) > 1 else ""
        is_foreign = 1 if re.search(r"外国", item["市場・商品区分"]) else 0

        if not re.search(r"^[\dA-Z]{4}$", ticker):
            continue

        if re.search(r"プライム", item["市場・商品区分"]):
            division = "プライム"

        elif re.search(r"スタンダード", item["市場・商品区分"]):
            division = "スタンダード"

        elif re.search(r"グロース", item["市場・商品区分"]):
            division = "グロース"

        elif re.search(r"出資証券", item["市場・商品区分"]):
            division = "出資証券"
            name = re.sub(r"\s*(優先)?出資証券\s*", "", name)

        elif re.search(r"REIT", item["市場・商品区分"]):
            division = "REIT"
            name = re.sub(r"\s*投資法人\s*", "", name)

        else:
            continue

        if not isinstance(ticker, str) or len(ticker) == 0:
            raise RuntimeError("Could not find a ticker.")

        if not isinstance(division, str) or len(division) == 0:
            raise RuntimeError("Could not find a division.")

        if not isinstance(name, str) or len(name) == 0:
            raise RuntimeError("Could not find a name.")

        values.append(
            (
                "",
                "",
                ticker,
                "東証",
                division,
                name,
                "",
                "",
                "",
                "",
                "",
                scale,
                "",
                is_foreign,
            )
        )

    insert_into_stocks_table(values)

except mysql.connector.Error:
    logger.error(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
