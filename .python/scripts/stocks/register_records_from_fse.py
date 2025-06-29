#!/usr/bin/env python

import traceback

import mysql.connector
import requests
from bs4 import BeautifulSoup

from lib.constants import FSE_EQUITY_LIST_URL
from lib.functions import create_logger, insert_into_stocks_table

logger = create_logger(__name__)
values = []

try:
    res = requests.get(FSE_EQUITY_LIST_URL)
    res.raise_for_status()
    soup = BeautifulSoup(res.text, "html.parser")
    tables = soup.select(".scroll_box_01 > table")

    if len(tables) == 0:
        raise RuntimeError("Could not find table tags in the HTML file.")

    for table in tables:
        rows = table.select("tbody > tr")
        ticker = rows[0].select("*")[3].get_text().strip()
        division = rows[0].select("*")[7].get_text().strip()

        if rows[1].find("td").find("a"):
            name = rows[1].find("td").find("a").find("img")["alt"].strip()
        else:
            name = rows[1].find("td").get_text().strip()

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
                "福証",
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
