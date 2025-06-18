#!/usr/bin/env python

import re
import traceback

import mysql.connector
import requests
from bs4 import BeautifulSoup

from lib.constants import SSE_EQUITY_LIST_URL
from lib.functions import create_logger, insert_into_stocks_table

logger = create_logger(__name__)
ticker_to_name_for_tandoku = {}
tickers_for_ambitious = []
values = []


try:
    res = requests.get(SSE_EQUITY_LIST_URL)
    res.raise_for_status()
    list_soup = BeautifulSoup(res.text, "html.parser")

    # 単独上場企業
    for anchor in list_soup.find_all("a", class_="tandoku"):
        matched = re.search(r"^([\dA-Z]{4})(.+)$", anchor.get_text())

        if matched is None:
            raise RuntimeError("Could not find ticker.")

        ticker = matched.groups()[0]
        name = re.sub(r"(^株式会社|株式会社$)", "", matched.groups()[1])
        ticker_to_name_for_tandoku[ticker] = name

    if len(ticker_to_name_for_tandoku) == 0:
        raise RuntimeError("Could not find companies.")

    # アンビシャス市場の企業
    for anchor in list_soup.find("section", id="cat22").find_all("a"):
        matched = re.search(r"^([\dA-Z]{4})", anchor.get_text())

        if matched is None:
            raise RuntimeError("Could not find ticker.")

        ticker = matched.groups()[0]
        tickers_for_ambitious.append(ticker)

    if len(tickers_for_ambitious) == 0:
        raise RuntimeError("Could not find companies for Ambitious market.")

    # 各企業の個別ページから情報を取得する
    for ticker, name in ticker_to_name_for_tandoku.items():
        division = "アンビシャス" if ticker in tickers_for_ambitious else "本則"

        values.append(
            (
                "",
                "",
                ticker,
                "札証",
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
