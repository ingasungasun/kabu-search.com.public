#!/usr/bin/env python

import traceback
import urllib.parse

import mysql.connector

from lib.constants import MYSQL_CONFIG, PROD_URL
from lib.functions import create_logger

logger = create_logger(__name__)

FILE_PATH = "/var/www/public/sitemap.xml"
INDENT = "  "
DATE_FORMAT = "%Y-%m-%d"


def fetch_industries():
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute(
            """
            SELECT name
            FROM master_stock_industries
            WHERE name != ''
            ORDER BY id ASC
            """
        )
        records = cursor.fetchall()
        return [urllib.parse.quote(record[0]) for record in records]


def fetch_stocks():
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                ticker,
                (
                    SELECT MAX(period_end)
                    FROM reports
                    WHERE stocks.ticker = reports.ticker
                ) AS period_end
            FROM
                stocks
            WHERE
                ticker IN (
                    SELECT ticker
                    FROM reports
                    GROUP BY ticker
                )
            ORDER BY
                ticker ASC
            """
        )
        return cursor.fetchall()


def generate():
    urls = []
    urls.append({"loc": ""})
    urls.append({"loc": "/charts"})
    urls.append({"loc": "/ranking"})
    urls.append({"loc": "/screening"})

    # stocks
    for record in stock_records:
        ticker = record[0]
        period_end = record[1]
        lastmod = period_end.strftime(DATE_FORMAT)

        urls.append(
            {
                "loc": f"/stocks/{ticker}/charts",
                "lastmod": lastmod,
            },
        )
        urls.append(
            {
                "loc": f"/stocks/{ticker}/indicators",
                "lastmod": lastmod,
            },
        )
        urls.append(
            {
                "loc": f"/stocks/{ticker}/performances",
                "lastmod": lastmod,
            },
        )
        urls.append(
            {
                "loc": f"/stocks/{ticker}/documents/pl",
                "lastmod": lastmod,
            }
        )
        urls.append(
            {
                "loc": f"/stocks/{ticker}/documents/bs",
                "lastmod": lastmod,
            }
        )
        urls.append(
            {
                "loc": f"/stocks/{ticker}/documents/cf",
                "lastmod": lastmod,
            }
        )

    with open(FILE_PATH, mode="w") as file:
        file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        file.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')

        for url in urls:
            file.write(f"{INDENT}<url>\n")

            if "loc" in url:
                loc = url["loc"]
                value = f"{PROD_URL}{loc}"
                file.write(f"{INDENT*2}<loc>{value}</loc>\n")
            else:
                raise RuntimeError("Some elements doesn't have loc property.")

            if "lastmod" in url:
                value = url["lastmod"]
                file.write(f"{INDENT*2}<lastmod>{value}</lastmod>\n")

            file.write(f"{INDENT}</url>\n")

        file.write("</urlset>\n")


try:
    industries = fetch_industries()
    stock_records = fetch_stocks()
    generate()

except mysql.connector.Error:
    logger.error(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
