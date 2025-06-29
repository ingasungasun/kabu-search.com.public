#!/usr/bin/env python

import concurrent.futures
import contextlib
import re
import sys
import traceback

import mysql.connector
import requests
from bs4 import BeautifulSoup

from lib.constants import MYSQL_CONFIG
from lib.functions import create_logger

logger = create_logger(__name__)

LIMIT = 100
MAX_WORKERS = LIMIT
URL = "https://minkabu.jp/stock/{ticker}/fundamental"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    " (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)


def fetch_website(ticker: str):
    res = requests.get(
        URL.format(ticker=ticker),
        headers={
            "User-Agent": USER_AGENT,
        },
    )
    res.raise_for_status()
    soup = BeautifulSoup(res.text, "html.parser")
    return (
        soup.find(id="contents").find_all("div")[2].find_all("div")[0].find("a")["href"]
    )


"""
外部サイトから企業のウェブサイトを取得して更新する
"""
try:
    values: list[tuple] = []

    with contextlib.suppress(IndexError):
        MAX_WORKERS = LIMIT = int(sys.argv[1])

    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute(
            f"""
            SELECT ticker
            FROM stocks
            WHERE division != 'REIT' AND website = ''
            LIMIT {LIMIT}
            """
        )
        records = cursor.fetchall()

    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_ticker = {
            executor.submit(fetch_website, record[0]): record[0] for record in records
        }

        for future in concurrent.futures.as_completed(future_to_ticker):
            ticker = future_to_ticker[future]
            website = future.result()

            if bool(re.search(r"^https?:", website)):
                website = re.sub(r"^https?:", "", website)
                values.append(
                    (
                        website,
                        ticker,
                    )
                )
            else:
                message = "The website URL is malformed.\n"
                message += f"ticker: {ticker}\n"
                message += f"website: {website}"
                logger.info(message)

    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.executemany(
            "UPDATE stocks SET website = %s WHERE ticker = %s",
            values,
        )
        cnx.commit()

except RuntimeError:
    logger.info(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
