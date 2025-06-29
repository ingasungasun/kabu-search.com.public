#!/usr/bin/env python

import re
import traceback

import mysql.connector
from bs4 import BeautifulSoup

from lib.constants import NSE_HTML_PATH
from lib.functions import create_logger, insert_into_stocks_table

logger = create_logger(__name__)
values = []

try:
    """
    名証のウェブサイトは JS によってレンダリングされるのでスクレイピングが無効となる。
    そのためブラウザの開発ツールで HTML を取得する。
    取得した HTML は、NSE_HTML_PATH 定数のファイルに保存する。
    """
    with open(NSE_HTML_PATH) as file:
        soup = BeautifulSoup(file.read(), "html.parser")

    table = soup.find("table", {"data-search-tbl": ""}, class_="tbl")

    if not table:
        raise RuntimeError("Could not find a search results table.")

    rows = table.select("tbody > tr")

    if len(rows) == 0:
        raise RuntimeError("Could not find rows.")

    # テーブルの最初の row はヘッダのためスルーする
    for row in rows[1:]:
        name_with_ticker = row.select("td")[1].get_text()
        division_with_suffix = row.select("td")[2].get_text()

        name_with_ticker_regex = re.search(r"^(.+)（([\dA-Z]{4})0）$", name_with_ticker)
        name = name_with_ticker_regex.group(1).strip()
        ticker = name_with_ticker_regex.group(2).strip()
        division = re.sub(r"\s*市場\s*", "", division_with_suffix).strip()

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
                "名証",
                division,
                name,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                0,
            )
        )

    insert_into_stocks_table(values)

except mysql.connector.Error:
    logger.error(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
